---
# Best Wishes E-commerce Platform - Class Diagram Documentation

## Overview
This class diagram represents the complete architecture of the Best Wishes e-commerce platform, showing the relationships between data models, business logic controllers, middleware, and utility services.

## Architecture Layers

### 1. Models (Data Layer)
The data models represent the core entities and their relationships in the system:

#### Core Entities
- **User**: Represents system users with different roles (user, admin, inventoryManager, deliveryStaff)
- **Product**: Catalog items with customization capabilities, variants, and inventory management
- **Order**: Purchase transactions with status tracking and delivery management
- **Category**: Product categorization with dynamic attributes

#### E-commerce Features
- **Customization**: Product personalization for mugs, cards, etc.
- **Feedback**: Product reviews and ratings system
- **Cart**: Shopping cart functionality (empty model - likely client-side)

#### Collaborative & Social Features
- **CollaborativePurchase**: Group buying functionality for shared gifts
- **GiftContribution**: Contribution-based gift purchasing
- **SurpriseGift**: Surprise delivery service with costume options

#### Notification & Communication
- **Notification**: System-wide notification system
- **EventReminder**: Reminder system for special occasions
- **Event**: Event management for promotions and seasonal content
- **Otp**: One-time password for authentication

### 2. Controllers (Business Logic Layer)
Controllers implement the business logic and API endpoints:

- **AuthController**: Authentication, registration, password management
- **ProductController**: Product CRUD, search, categorization
- **OrderController**: Order management, status tracking, delivery
- **CollaborativePurchaseController**: Group buying logic
- **CustomizationController**: Product personalization workflow
- **NotificationController**: Notification management
- **FeedbackController**: Review and rating system
- **DeliveryController**: Delivery staff operations
- **EventController**: Event management
- **SurpriseGiftController**: Surprise delivery service

### 3. Middleware Layer
Security and validation components:

- **AuthMiddleware**: JWT authentication and role-based authorization
- **ValidationMiddleware**: Input validation using express-validator
- **UploadMiddleware**: File upload handling with Multer
- **ErrorHandler**: Centralized error handling

### 4. Utils & Services
Utility services for external integrations:

- **EmailService**: Email notifications and OTP delivery
- **CloudinaryService**: Media upload and management
- **TokenGenerator**: JWT and security token management

## Key Relationships

### User Relationships
- Users can place multiple Orders
- Users can set multiple EventReminders
- Users receive Notifications
- Users write Feedback for products
- Users create CollaborativePurchases and GiftContributions
- Users can create Customizations

### Product Relationships
- Products belong to Categories
- Products can have multiple Customizations
- Products receive Feedback from users
- Products are part of Orders through OrderItems

### Order Management
- Orders contain multiple OrderItems
- Orders have StatusHistory for tracking
- Orders can generate Notifications
- Orders can include Customizations

## Special Features

### Customization System
The platform supports product customization with:
- Different types: mugs, birthday cards, anniversary cards, general cards
- Quote selection system
- Custom messages and styling options
- Preview generation
- Price calculations

### Collaborative Purchasing
Supports group buying with:
- Participant management
- Payment tracking per participant
- Deadline management
- Status progression from pending to delivered

### Role-Based Access Control
Four user roles with different permissions:
- **user**: Regular customers
- **admin**: Full system access
- **inventoryManager**: Inventory and product management
- **deliveryStaff**: Delivery operations

### Notification System
Comprehensive notification system with:
- Different types: order, system, promotion, reminder, gift
- Priority levels: low, medium, high
- Read/unread status tracking
- Action URLs for interactive notifications

## Technology Stack
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **File Upload**: Multer with Cloudinary integration
- **Email**: Nodemailer for notifications
- **Validation**: express-validator
- **Security**: Role-based middleware protection

## Deployment Architecture
- **Frontend**: Next.js (React-based)
- **Backend**: Node.js/Express API
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **Payments**: Stripe integration (referenced in collaborative purchases)
- **Email**: SMTP configuration for notifications

This architecture supports a full-featured e-commerce platform with social shopping features, product customization, collaborative purchasing, and comprehensive order management.