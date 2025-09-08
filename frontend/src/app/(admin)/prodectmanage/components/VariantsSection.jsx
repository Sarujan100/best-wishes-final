// "use client"

// import { useState } from "react"
// import { Button } from "../../../../components/ui/button"
// import { Input } from "../../../../components/ui/input"
// import { Label } from "../../../../components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
// import { Badge } from "../../../../components/ui/badge"
// import { Plus, X, Edit, Copy, Package, Trash2, Save, Edit2 } from "lucide-react"

// export default function VariantsSection({ variants = [], onChange }) {
//   const [variantGroups, setVariantGroups] = useState([
//     { id: 1, name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
//     { id: 2, name: "Color", values: ["Red", "Blue", "Green", "Black", "White"] },
//     { id: 3, name: "Material", values: ["Cotton", "Polyester", "Wool", "Silk"] },
//   ])
//   const [selectedGroups, setSelectedGroups] = useState([])
//   const [showBulkEdit, setShowBulkEdit] = useState(false)
//   const [bulkEditData, setBulkEditData] = useState({
//     price: "",
//     stock: "",
//     weight: "",
//   })
//   const [editingGroup, setEditingGroup] = useState(null)
//   const [editGroupName, setEditGroupName] = useState("")
//   const [selectedVariants, setSelectedVariants] = useState([])
//   const [selectAllVariants, setSelectAllVariants] = useState(false)

//   // Variant Group CRUD Operations
//   const addVariantGroup = () => {
//     const name = prompt("Enter variant group name (e.g., Size, Color):")
//     if (name && !variantGroups.find((g) => g.name.toLowerCase() === name.toLowerCase())) {
//       const newGroup = {
//         id: Date.now(),
//         name,
//         values: [],
//       }
//       setVariantGroups([...variantGroups, newGroup])
//     } else if (name) {
//       alert("A group with this name already exists!")
//     }
//   }

//   const editVariantGroup = (groupId, newName) => {
//     if (newName && !variantGroups.find((g) => g.id !== groupId && g.name.toLowerCase() === newName.toLowerCase())) {
//       setVariantGroups(variantGroups.map((group) => (group.id === groupId ? { ...group, name: newName } : group)))
//     }
//     setEditingGroup(null)
//     setEditGroupName("")
//   }

//   const deleteVariantGroup = (groupId) => {
//     if (confirm("Delete this variant group? This will remove all its values.")) {
//       setVariantGroups(variantGroups.filter((group) => group.id !== groupId))
//       setSelectedGroups(selectedGroups.filter((group) => group.id !== groupId))
//       generateVariants()
//     }
//   }

//   const startEditGroup = (group) => {
//     setEditingGroup(group.id)
//     setEditGroupName(group.name)
//   }

//   const cancelEditGroup = () => {
//     setEditingGroup(null)
//     setEditGroupName("")
//   }

//   // Variant Value CRUD Operations
//   const addVariantValue = (groupId) => {
//     const value = prompt("Enter variant value:")
//     if (value) {
//       const newGroups = variantGroups.map((group) => {
//         if (group.id === groupId && !group.values.includes(value)) {
//           return { ...group, values: [...group.values, value] }
//         }
//         return group
//       })
//       setVariantGroups(newGroups)
//       generateVariants()
//     }
//   }

//   const editVariantValue = (groupId, oldValue, newValue) => {
//     if (newValue && newValue !== oldValue) {
//       const newGroups = variantGroups.map((group) => {
//         if (group.id === groupId) {
//           const values = group.values.map((v) => (v === oldValue ? newValue : v))
//           return { ...group, values }
//         }
//         return group
//       })
//       setVariantGroups(newGroups)
//       generateVariants()
//     }
//   }

//   const removeVariantValue = (groupId, valueToRemove) => {
//     if (confirm(`Remove "${valueToRemove}" from this group?`)) {
//       const newGroups = variantGroups.map((group) => {
//         if (group.id === groupId) {
//           return { ...group, values: group.values.filter((v) => v !== valueToRemove) }
//         }
//         return group
//       })
//       setVariantGroups(newGroups)
//       generateVariants()
//     }
//   }

//   const toggleVariantGroup = (group) => {
//     const isSelected = selectedGroups.find((g) => g.id === group.id)
//     if (isSelected) {
//       setSelectedGroups(selectedGroups.filter((g) => g.id !== group.id))
//     } else {
//       setSelectedGroups([...selectedGroups, group])
//     }
//     setTimeout(generateVariants, 0)
//   }

//   const generateVariants = () => {
//     if (selectedGroups.length === 0) {
//       onChange([])
//       return
//     }

//     const combinations = generateCombinations(selectedGroups)
//     const newVariants = combinations.map((combination, index) => {
//       const existingVariant = variants.find((v) => JSON.stringify(v.attributes) === JSON.stringify(combination))

//       return (
//         existingVariant || {
//           id: Date.now() + index,
//           sku: `VAR-${Date.now()}-${index}`,
//           attributes: combination,
//           price: 0,
//           stock: 0,
//           weight: 0,
//           enabled: true,
//         }
//       )
//     })

//     onChange(newVariants)
//   }

//   const generateCombinations = (groups) => {
//     if (groups.length === 0) return []
//     if (groups.length === 1) {
//       return groups[0].values.map((value) => ({ [groups[0].name]: value }))
//     }

//     const [first, ...rest] = groups
//     const restCombinations = generateCombinations(rest)
//     const combinations = []

//     for (const value of first.values) {
//       for (const restCombination of restCombinations) {
//         combinations.push({ [first.name]: value, ...restCombination })
//       }
//     }

//     return combinations
//   }

//   // Variant CRUD Operations
//   const updateVariant = (variantId, field, value) => {
//     const newVariants = variants.map((variant) =>
//       variant.id === variantId
//         ? { ...variant, [field]: field === "enabled" ? value : Number.parseFloat(value) || value }
//         : variant,
//     )
//     onChange(newVariants)
//   }

//   const duplicateVariant = (variantId) => {
//     const variant = variants.find((v) => v.id === variantId)
//     if (variant) {
//       const newVariant = {
//         ...variant,
//         id: Date.now(),
//         sku: `${variant.sku}-COPY`,
//       }
//       onChange([...variants, newVariant])
//     }
//   }

//   const removeVariant = (variantId) => {
//     if (confirm("Delete this variant?")) {
//       onChange(variants.filter((v) => v.id !== variantId))
//       setSelectedVariants(selectedVariants.filter((id) => id !== variantId))
//     }
//   }

//   // Bulk Variant Operations
//   const toggleVariantSelection = (variantId) => {
//     if (selectedVariants.includes(variantId)) {
//       setSelectedVariants(selectedVariants.filter((id) => id !== variantId))
//     } else {
//       setSelectedVariants([...selectedVariants, variantId])
//     }
//   }

//   const toggleSelectAllVariants = () => {
//     if (selectAllVariants) {
//       setSelectedVariants([])
//     } else {
//       setSelectedVariants(variants.map((v) => v.id))
//     }
//     setSelectAllVariants(!selectAllVariants)
//   }

//   const deleteSelectedVariants = () => {
//     if (confirm(`Delete ${selectedVariants.length} selected variants?`)) {
//       const remainingVariants = variants.filter((v) => !selectedVariants.includes(v.id))
//       onChange(remainingVariants)
//       setSelectedVariants([])
//       setSelectAllVariants(false)
//     }
//   }

//   const applyBulkEdit = () => {
//     const variantsToUpdate =
//       selectedVariants.length > 0 ? variants.filter((v) => selectedVariants.includes(v.id)) : variants

//     const newVariants = variants.map((variant) => {
//       if (variantsToUpdate.includes(variant)) {
//         return {
//           ...variant,
//           ...(bulkEditData.price && { price: Number.parseFloat(bulkEditData.price) }),
//           ...(bulkEditData.stock && { stock: Number.parseFloat(bulkEditData.stock) }),
//           ...(bulkEditData.weight && { weight: Number.parseFloat(bulkEditData.weight) }),
//         }
//       }
//       return variant
//     })

//     onChange(newVariants)
//     setBulkEditData({ price: "", stock: "", weight: "" })
//     setShowBulkEdit(false)
//   }

//   const getVariantDisplayName = (attributes) => {
//     return Object.entries(attributes)
//       .map(([key, value]) => `${key}: ${value}`)
//       .join(", ")
//   }

//   return (
//     <div className="space-y-6">
//       {/* Variant Groups Configuration */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             <span className="flex items-center gap-2">
//               <Package className="w-5 h-5" />
//               Variant Groups ({variantGroups.length})
//             </span>
//             <Button type="button" variant="outline" size="sm" onClick={addVariantGroup}>
//               <Plus className="w-4 h-4 mr-2" />
//               Add Group
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {variantGroups.map((group) => (
//             <div key={group.id} className="border rounded-lg p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedGroups.some((g) => g.id === group.id)}
//                     onChange={() => toggleVariantGroup(group)}
//                     className="w-4 h-4"
//                   />
//                   {editingGroup === group.id ? (
//                     <div className="flex items-center gap-2">
//                       <Input
//                         value={editGroupName}
//                         onChange={(e) => setEditGroupName(e.target.value)}
//                         className="h-8 w-32"
//                         onKeyPress={(e) => {
//                           if (e.key === "Enter") editVariantGroup(group.id, editGroupName)
//                           if (e.key === "Escape") cancelEditGroup()
//                         }}
//                         autoFocus
//                       />
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => editVariantGroup(group.id, editGroupName)}
//                       >
//                         <Save className="w-4 h-4" />
//                       </Button>
//                       <Button type="button" size="sm" variant="ghost" onClick={cancelEditGroup}>
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-medium">{group.name}</h4>
//                       <Button type="button" size="sm" variant="ghost" onClick={() => startEditGroup(group)}>
//                         <Edit2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex gap-2">
//                   <Button type="button" variant="outline" size="sm" onClick={() => addVariantValue(group.id)}>
//                     <Plus className="w-4 h-4" />
//                   </Button>
//                   <Button type="button" variant="destructive" size="sm" onClick={() => deleteVariantGroup(group.id)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {group.values.map((value, valueIndex) => (
//                   <Badge key={valueIndex} variant="secondary" className="flex items-center gap-1">
//                     {value}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const newValue = prompt("Edit value:", value)
//                         if (newValue) editVariantValue(group.id, value, newValue)
//                       }}
//                       className="ml-1 hover:text-blue-500"
//                     >
//                       <Edit2 className="w-3 h-3" />
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => removeVariantValue(group.id, value)}
//                       className="ml-1 hover:text-red-500"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Generated Variants */}
//       {variants.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <span>Product Variants ({variants.length})</span>
//               <div className="flex items-center gap-2">
//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={selectAllVariants}
//                     onChange={toggleSelectAllVariants}
//                     className="w-4 h-4"
//                   />
//                   Select All
//                 </label>
//                 <Button type="button" variant="outline" size="sm" onClick={() => setShowBulkEdit(!showBulkEdit)}>
//                   <Edit className="w-4 h-4 mr-2" />
//                   Bulk Edit
//                 </Button>
//                 {selectedVariants.length > 0 && (
//                   <Button type="button" variant="destructive" size="sm" onClick={deleteSelectedVariants}>
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete ({selectedVariants.length})
//                   </Button>
//                 )}
//               </div>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Bulk Edit Panel */}
//             {showBulkEdit && (
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-medium mb-3">
//                   Bulk Edit {selectedVariants.length > 0 ? `Selected (${selectedVariants.length})` : "All"} Variants
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Label>Price</Label>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       value={bulkEditData.price}
//                       onChange={(e) => setBulkEditData({ ...bulkEditData, price: e.target.value })}
//                       placeholder="Leave empty to skip"
//                     />
//                   </div>
//                   <div>
//                     <Label>Stock</Label>
//                     <Input
//                       type="number"
//                       value={bulkEditData.stock}
//                       onChange={(e) => setBulkEditData({ ...bulkEditData, stock: e.target.value })}
//                       placeholder="Leave empty to skip"
//                     />
//                   </div>
//                   <div>
//                     <Label>Weight</Label>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       value={bulkEditData.weight}
//                       onChange={(e) => setBulkEditData({ ...bulkEditData, weight: e.target.value })}
//                       placeholder="Leave empty to skip"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-2 mt-4">
//                   <Button type="button" onClick={applyBulkEdit}>
//                     Apply Changes
//                   </Button>
//                   <Button type="button" variant="outline" onClick={() => setShowBulkEdit(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Variants List */}
//             <div className="space-y-4">
//               {variants.map((variant) => (
//                 <div key={variant.id} className="border rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="checkbox"
//                         checked={selectedVariants.includes(variant.id)}
//                         onChange={() => toggleVariantSelection(variant.id)}
//                         className="w-4 h-4"
//                       />
//                       <input
//                         type="checkbox"
//                         checked={variant.enabled}
//                         onChange={(e) => updateVariant(variant.id, "enabled", e.target.checked)}
//                         className="w-4 h-4"
//                       />
//                       <div>
//                         <h5 className="font-medium">{getVariantDisplayName(variant.attributes)}</h5>
//                         <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button type="button" variant="outline" size="sm" onClick={() => duplicateVariant(variant.id)}>
//                         <Copy className="w-4 h-4" />
//                       </Button>
//                       <Button type="button" variant="outline" size="sm" onClick={() => removeVariant(variant.id)}>
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                       <Label>SKU</Label>
//                       <Input
//                         value={variant.sku}
//                         onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
//                         disabled={!variant.enabled}
//                       />
//                     </div>
//                     <div>
//                       <Label>Price</Label>
//                       <Input
//                         type="number"
//                         step="0.01"
//                         value={variant.price}
//                         onChange={(e) => updateVariant(variant.id, "price", e.target.value)}
//                         disabled={!variant.enabled}
//                       />
//                     </div>
//                     <div>
//                       <Label>Stock</Label>
//                       <Input
//                         type="number"
//                         value={variant.stock}
//                         onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
//                         disabled={!variant.enabled}
//                       />
//                     </div>
//                     <div>
//                       <Label>Weight (kg)</Label>
//                       <Input
//                         type="number"
//                         step="0.01"
//                         value={variant.weight}
//                         onChange={(e) => updateVariant(variant.id, "weight", e.target.value)}
//                         disabled={!variant.enabled}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Variant Preview */}
//       {variants.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Variant Combinations Preview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {variants
//                 .filter((v) => v.enabled)
//                 .map((variant) => (
//                   <div key={variant.id} className="border rounded-lg p-3">
//                     <div className="flex justify-between items-start mb-2">
//                       <h6 className="font-medium text-sm">{getVariantDisplayName(variant.attributes)}</h6>
//                       <Badge variant={variant.stock > 0 ? "default" : "destructive"}>
//                         {variant.stock > 0 ? "In Stock" : "Out of Stock"}
//                       </Badge>
//                     </div>
//                     <div className="text-sm text-gray-600 space-y-1">
//                       <p>SKU: {variant.sku}</p>
//                       <p>Price: ${variant.price}</p>
//                       <p>Stock: {variant.stock}</p>
//                       <p>Weight: {variant.weight}kg</p>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }
