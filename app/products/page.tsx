"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Box, Edit, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProductMaster() {
  const { toast } = useToast()
  const [products, setProducts] = useState([
    {
      id: 1,
      sku: "PA-001",
      name: "Product Alpha",
      type: "Finished Good",
      category: "Category A",
      minStock: 100,
      reorderLevel: 150,
      rawMaterials: "RM-A: 2kg, RM-B: 1L",
      unitPrice: 500,
      description: "High-quality product for premium market",
      status: "Active",
    },
    {
      id: 2,
      sku: "PB-002",
      name: "Product Beta",
      type: "Finished Good",
      category: "Category B",
      minStock: 80,
      reorderLevel: 120,
      rawMaterials: "RM-A: 1.5kg, RM-C: 0.5kg",
      unitPrice: 350,
      description: "Standard product for general market",
      status: "Active",
    },
    {
      id: 3,
      sku: "PG-003",
      name: "Product Gamma",
      type: "Finished Good",
      category: "Category A",
      minStock: 60,
      reorderLevel: 100,
      rawMaterials: "RM-B: 2L, RM-D: 1kg",
      unitPrice: 750,
      description: "Premium product with advanced features",
      status: "Active",
    },
  ])

  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    type: "",
    category: "",
    minStock: "",
    reorderLevel: "",
    rawMaterials: "",
    unitPrice: "",
    description: "",
  })

  const [editingProduct, setEditingProduct] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProduct.sku || !newProduct.name || !newProduct.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate SKU
    const existingSKU = products.find((p) => p.sku.toLowerCase() === newProduct.sku.toLowerCase())
    if (existingSKU && !editingProduct) {
      toast({
        title: "Error",
        description: "SKU already exists. Please use a different SKU.",
        variant: "destructive",
      })
      return
    }

    if (editingProduct) {
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              sku: newProduct.sku,
              name: newProduct.name,
              type: newProduct.type,
              category: newProduct.category,
              minStock: Number.parseInt(newProduct.minStock) || 0,
              reorderLevel: Number.parseInt(newProduct.reorderLevel) || 0,
              rawMaterials: newProduct.rawMaterials,
              unitPrice: Number.parseInt(newProduct.unitPrice) || 0,
              description: newProduct.description,
            }
          : product,
      )

      setProducts(updatedProducts)
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
    } else {
      const product = {
        id: products.length + 1,
        sku: newProduct.sku,
        name: newProduct.name,
        type: newProduct.type,
        category: newProduct.category,
        minStock: Number.parseInt(newProduct.minStock) || 0,
        reorderLevel: Number.parseInt(newProduct.reorderLevel) || 0,
        rawMaterials: newProduct.rawMaterials,
        unitPrice: Number.parseInt(newProduct.unitPrice) || 0,
        description: newProduct.description,
        status: "Active",
      }

      setProducts([...products, product])
      toast({
        title: "Success",
        description: "Product added successfully",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setNewProduct({
      sku: product.sku,
      name: product.name,
      type: product.type,
      category: product.category,
      minStock: product.minStock.toString(),
      reorderLevel: product.reorderLevel.toString(),
      rawMaterials: product.rawMaterials,
      unitPrice: product.unitPrice.toString(),
      description: product.description,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setNewProduct({
      sku: "",
      name: "",
      type: "",
      category: "",
      minStock: "",
      reorderLevel: "",
      rawMaterials: "",
      unitPrice: "",
      description: "",
    })
    setEditingProduct(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 hero-pattern"></div>

      <header className="relative z-10 flex h-20 shrink-0 items-center gap-2 border-b border-white/20 bg-white/80 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1 hover:bg-cyan-100 transition-colors duration-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <Box className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Product Master
              </h1>
              <p className="text-sm text-dark-secondary font-semibold">Manage product catalog and specifications</p>
            </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product information" : "Enter product details and specifications"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="Enter SKU"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Product Type *</Label>
                  <Select
                    value={newProduct.type}
                    onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finished Good">Finished Good</SelectItem>
                      <SelectItem value="Raw Material">Raw Material</SelectItem>
                      <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Category A">Category A</SelectItem>
                      <SelectItem value="Category B">Category B</SelectItem>
                      <SelectItem value="Category C">Category C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                    placeholder="Minimum stock"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    value={newProduct.reorderLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: e.target.value })}
                    placeholder="Reorder level"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
                    placeholder="Unit price"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rawMaterials">Raw Materials Formula</Label>
                <Input
                  id="rawMaterials"
                  value={newProduct.rawMaterials}
                  onChange={(e) => setNewProduct({ ...newProduct, rawMaterials: e.target.value })}
                  placeholder="e.g., RM-A: 2kg, RM-B: 1L"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(products.map((p) => p.category)).size}</div>
              <p className="text-xs text-muted-foreground">Product categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Unit Price</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{Math.round(products.reduce((sum, p) => sum + p.unitPrice, 0) / products.length)}
              </div>
              <p className="text-xs text-muted-foreground">Average price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Status</CardTitle>
              <Badge variant="secondary">All Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">Products active</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Product Catalog</CardTitle>
            <CardDescription className="text-slate-700">Complete list of products with specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">SKU</TableHead>
                  <TableHead className="font-bold">Product Name</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Min Stock</TableHead>
                  <TableHead className="font-bold">Reorder Level</TableHead>
                  <TableHead className="font-bold">Unit Price</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-slate-700">{product.sku}</TableCell>
                    <TableCell className="text-slate-700">{product.name}</TableCell>
                    <TableCell className="text-slate-700">{product.type}</TableCell>
                    <TableCell className="text-slate-700">{product.category}</TableCell>
                    <TableCell className="text-slate-700">{product.minStock}</TableCell>
                    <TableCell className="text-slate-700">{product.reorderLevel}</TableCell>
                    <TableCell className="text-slate-700">₹{product.unitPrice}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
