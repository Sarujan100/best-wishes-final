"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Modal, useConfirmModal } from "../../../components/ui/modal"

export default function ModalDemo() {
  const { 
    isOpen, 
    config, 
    showConfirm, 
    showDelete, 
    showEdit, 
    showSuccess, 
    showError, 
    closeModal 
  } = useConfirmModal()

  const handleSuccessDemo = () => {
    showSuccess(
      "Success!", 
      "Your action was completed successfully. This is a success message with a green checkmark icon.",
      () => console.log("Success confirmed")
    )
  }

  const handleErrorDemo = () => {
    showError(
      "Error Occurred", 
      "Something went wrong. Please try again or contact support if the problem persists.",
      () => console.log("Error acknowledged")
    )
  }

  const handleConfirmDemo = () => {
    showConfirm(
      "Confirm Action", 
      "Are you sure you want to proceed with this action? This will make changes to your data.",
      () => {
        console.log("Action confirmed")
        showSuccess("Confirmed", "Your action has been confirmed and executed successfully!")
      }
    )
  }

  const handleDeleteDemo = () => {
    showDelete(
      "Delete Item", 
      "Are you sure you want to delete this item? This action cannot be undone and will permanently remove the item from the system.",
      () => {
        console.log("Item deleted")
        showSuccess("Deleted", "The item has been successfully deleted!")
      }
    )
  }

  const handleEditDemo = () => {
    showEdit(
      "Save Changes", 
      "Do you want to save the changes you made to this item? Unsaved changes will be lost.",
      () => {
        console.log("Changes saved")
        showSuccess("Saved", "Your changes have been saved successfully!")
      }
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Custom Modal Demo</h1>
        <p className="text-gray-600">Click the buttons below to see different types of custom modals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Success Modal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Shows a success message with a green checkmark icon and "OK" button.
            </p>
            <Button onClick={handleSuccessDemo} className="w-full">
              Show Success
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-600">✗</span>
              Error Modal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Shows an error message with a red warning icon and "OK" button.
            </p>
            <Button onClick={handleErrorDemo} variant="destructive" className="w-full">
              Show Error
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-blue-600">?</span>
              Confirm Modal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Shows a confirmation dialog with "Cancel" and "Confirm" buttons.
            </p>
            <Button onClick={handleConfirmDemo} variant="outline" className="w-full">
              Show Confirm
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-600">🗑️</span>
              Delete Modal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Shows a delete confirmation with a trash icon and destructive styling.
            </p>
            <Button onClick={handleDeleteDemo} variant="destructive" className="w-full">
              Show Delete
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-blue-600">✏️</span>
              Edit Modal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Shows an edit confirmation with a pencil icon and "Save" button.
            </p>
            <Button onClick={handleEditDemo} className="w-full">
              Show Edit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-purple-600">ℹ️</span>
              Info Modal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Shows an information message with an info icon and "OK" button.
            </p>
            <Button onClick={() => {
              showConfirm(
                "Information", 
                "This is an informational message. You can customize the title, message, and button text.",
                () => console.log("Info acknowledged"),
                { confirmText: "Got it!", showCancel: false }
              )
            }} variant="secondary" className="w-full">
              Show Info
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={config.title}
        message={config.message}
        type={config.type}
        onConfirm={config.onConfirm}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        showCancel={config.showCancel}
      >
        {config.children}
      </Modal>
    </div>
  )
} 