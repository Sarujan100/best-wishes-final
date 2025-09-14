package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Product represents a product in the database
type Product struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name   string             `bson:"name" json:"name"`
	SKU    string             `bson:"sku" json:"sku"`
	Stock  int                `bson:"stock" json:"stock"`
	Price  float64            `bson:"retailPrice" json:"price"`
	Status string             `bson:"status" json:"status"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ProductID primitive.ObjectID `json:"productId"`
	Quantity  int                `json:"quantity"`
}

// StockUpdate represents the result of a stock update operation
type StockUpdate struct {
	ProductID        primitive.ObjectID `json:"productId"`
	ProductName      string             `json:"productName"`
	OldStock         int                `json:"oldStock"`
	NewStock         int                `json:"newStock"`
	ReducedQuantity  int                `json:"reducedQuantity"`
}

// InsufficientStockItem represents an item with insufficient stock
type InsufficientStockItem struct {
	ProductID         primitive.ObjectID `json:"productId"`
	ProductName       string             `json:"productName"`
	RequestedQuantity int                `json:"requestedQuantity"`
	AvailableStock    int                `json:"availableStock"`
}

// ProcessOrderResponse represents the response from processing an order
type ProcessOrderResponse struct {
	Success               bool                    `json:"success"`
	Message               string                  `json:"message"`
	UpdatedItems          []StockUpdate           `json:"updatedItems,omitempty"`
	InsufficientStockItems []InsufficientStockItem `json:"insufficientStockItems,omitempty"`
	TotalItemsUpdated     int                     `json:"totalItemsUpdated"`
}

// ProcessOrder processes an order, checks stock, and updates the database
func ProcessOrder(db *mongo.Database, orderItems []OrderItem) ProcessOrderResponse {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	collection := db.Collection("products")

	// Validate input
	if len(orderItems) == 0 {
		return ProcessOrderResponse{
			Success: false,
			Message: "Items array is required and cannot be empty",
		}
	}

	var stockUpdates []StockUpdate
	var insufficientStockItems []InsufficientStockItem

	// Start a transaction session
	session, err := db.Client().StartSession()
	if err != nil {
		return ProcessOrderResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to start session: %v", err),
		}
	}
	defer session.EndSession(ctx)

	// Execute transaction
	err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {
		// Check stock availability for all items first
		for _, item := range orderItems {
			if item.Quantity <= 0 {
				return fmt.Errorf("invalid quantity: %d for product %s", item.Quantity, item.ProductID.Hex())
			}

			var product Product
			err := collection.FindOne(sc, bson.M{"_id": item.ProductID}).Decode(&product)
			if err != nil {
				if err == mongo.ErrNoDocuments {
					return fmt.Errorf("product not found: %s", item.ProductID.Hex())
				}
				return fmt.Errorf("failed to retrieve product %s: %v", item.ProductID.Hex(), err)
			}

			// Check if sufficient stock is available
			if product.Stock < item.Quantity {
				insufficientStockItems = append(insufficientStockItems, InsufficientStockItem{
					ProductID:         item.ProductID,
					ProductName:       product.Name,
					RequestedQuantity: item.Quantity,
					AvailableStock:    product.Stock,
				})
				continue
			}

			stockUpdates = append(stockUpdates, StockUpdate{
				ProductID:       item.ProductID,
				ProductName:     product.Name,
				OldStock:        product.Stock,
				NewStock:        product.Stock - item.Quantity,
				ReducedQuantity: item.Quantity,
			})
		}

		// If any items have insufficient stock, abort the transaction
		if len(insufficientStockItems) > 0 {
			return fmt.Errorf("insufficient stock for %d items", len(insufficientStockItems))
		}

		// Update stock for all items
		for _, update := range stockUpdates {
			filter := bson.M{"_id": update.ProductID}
			updateDoc := bson.M{
				"$inc": bson.M{"stock": -update.ReducedQuantity},
			}

			result, err := collection.UpdateOne(sc, filter, updateDoc)
			if err != nil {
				return fmt.Errorf("failed to update stock for product %s: %v", update.ProductName, err)
			}

			if result.MatchedCount == 0 {
				return fmt.Errorf("product not found during update: %s", update.ProductID.Hex())
			}
		}

		return nil
	})

	// Handle transaction result
	if err != nil {
		if len(insufficientStockItems) > 0 {
			return ProcessOrderResponse{
				Success:                false,
				Message:                "Insufficient stock for some items",
				InsufficientStockItems: insufficientStockItems,
			}
		}

		return ProcessOrderResponse{
			Success: false,
			Message: fmt.Sprintf("Error processing order: %v", err),
		}
	}

	// Return success response
	return ProcessOrderResponse{
		Success:           true,
		Message:           "Order processed successfully! Stock updated for all items.",
		UpdatedItems:      stockUpdates,
		TotalItemsUpdated: len(stockUpdates),
	}
}

// Example usage
func main() {
	// MongoDB connection
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(context.TODO())

	db := client.Database("bestwise") // Replace with your database name

	// Example order items
	productID1, _ := primitive.ObjectIDFromHex("676c0b7f8f9c123456789abc")
	productID2, _ := primitive.ObjectIDFromHex("676c0b7f8f9c123456789def")

	orderItems := []OrderItem{
		{ProductID: productID1, Quantity: 2},
		{ProductID: productID2, Quantity: 5},
	}

	// Process the order
	result := ProcessOrder(db, orderItems)

	if result.Success {
		fmt.Printf("✅ %s\n", result.Message)
		fmt.Printf("📊 Total items updated: %d\n", result.TotalItemsUpdated)
		
		for _, update := range result.UpdatedItems {
			fmt.Printf("📦 %s: %d → %d (-%d)\n", 
				update.ProductName, 
				update.OldStock, 
				update.NewStock, 
				update.ReducedQuantity)
		}
	} else {
		fmt.Printf("❌ %s\n", result.Message)
		
		if len(result.InsufficientStockItems) > 0 {
			fmt.Println("⚠️  Insufficient stock for:")
			for _, item := range result.InsufficientStockItems {
				fmt.Printf("   • %s: requested %d, available %d\n", 
					item.ProductName, 
					item.RequestedQuantity, 
					item.AvailableStock)
			}
		}
	}
}