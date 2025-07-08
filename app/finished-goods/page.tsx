"use client"

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
import { Plus, Package, TrendingUp, Factory } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FinishedGoods() {
  const { toast } = useToast()
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product Alpha",
      sku: "PA-001",
      currentStock: 150,
      minStock: 100,
      manufactured: "2024-01-15",
      batchNo: "FG001-2024",
      rawMaterialsUsed: "RM-A: 50kg, RM-B: 20L",
    },
    {
      id: 2,
      name: "Product Beta",
      sku: "PB-002",
      currentStock: 75,
      minStock: 100,
      manufactured: "2024-01-14",
      batchNo: "FG002-2024",
      rawMaterialsUsed: "RM-A: 30kg, RM-C: 15kg",
    },
    {
      id: 3,
      name: "Product Gamma",
      sku: "PG-003",
      currentStock: 200,
      minStock: 80,
      manufactured: "2024-01-16",
      batchNo: "FG003-2024",
      rawMaterialsUsed: "RM-B: 40L, RM-D: 25kg",
    },
  ])

  const [newProduction, setNewProduction] = useState({
    productName: "",
    sku: "",
    quantity: "",
    batchNo: "",
    rawMaterials: "",
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddProduction = () => {
    if (!newProduction.productName || !newProduction.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if product already exists
    const existingProduct = products.find((p) => p.name.toLowerCase() === newProduction.productName.toLowerCase())

    if (existingProduct) {
      // Update existing product stock
      const updatedProducts = products.map((product) =>
        product.id === existingProduct.id
          ? {
              ...product,
              currentStock: product.currentStock + Number.parseInt(newProduction.quantity),
              manufactured: new Date().toISOString().split("T")[0],
              batchNo: newProduction.batchNo || product.batchNo,
              rawMaterialsUsed: newProduction.rawMaterials || product.rawMaterialsUsed,
            }
          : product,
      )
      setProducts(updatedProducts)

      toast({
        title: "Success",
        description: `Added ${newProduction.quantity} units to ${newProduction.productName}`,
      })
    } else {
      // Add new product
      const production = {
        id: products.length + 1,
        name: newProduction.productName,
        sku: newProduction.sku || `SKU-${Date.now()}`,
        currentStock: Number.parseInt(newProduction.quantity),
        minStock: 100, // Default minimum stock
        manufactured: new Date().toISOString().split("T")[0],
        batchNo: newProduction.batchNo || `FG${String(products.length + 1).padStart(3, "0")}-2024`,
        rawMaterialsUsed: newProduction.rawMaterials || "Not specified",
      }

      setProducts([...products, production])

      toast({
        title: "Success",
        description: "Production logged successfully",
      })
    }

    setNewProduction({ productName: "", sku: "", quantity: "", batchNo: "", rawMaterials: "" })
    setDialogOpen(false)
  }

  const getLowStockCount = () => {
    return products.filter((p) => p.currentStock < p.minStock).length
  }

  const getTotalProduction = () => {
    return products.reduce((sum, product) => sum + product.currentStock, 0)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 hero-pattern"></div>

      <header className="relative z-10 flex h-20 shrink-0 items-center gap-2 border-b border-white/20 bg-white/80 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1 hover:bg-purple-100 transition-colors duration-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Finished Goods Management
              </h1>
              <p className="text-sm text-dark-secondary font-semibold">
                Track production, stock levels, and manufacturing details
              </p>
            </div>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Plus className="h-4 w-4 mr-2" />
              Log Production
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Production</DialogTitle>
              <DialogDescription>Record new finished goods manufacturing</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduction.productName}
                  onChange={(e) => setNewProduction({ ...newProduction, productName: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduction.sku}
                    onChange={(e) => setNewProduction({ ...newProduction, sku: e.target.value })}
                    placeholder="Product SKU"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity Produced</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduction.quantity}
                    onChange={(e) => setNewProduction({ ...newProduction, quantity: e.target.value })}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="batch">Batch Number</Label>
                <Input
                  id="batch"
                  value={newProduction.batchNo}
                  onChange={(e) => setNewProduction({ ...newProduction, batchNo: e.target.value })}
                  placeholder="Enter batch number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rawMaterials">Raw Materials Used</Label>
                <Input
                  id="rawMaterials"
                  value={newProduction.rawMaterials}
                  onChange={(e) => setNewProduction({ ...newProduction, rawMaterials: e.target.value })}
                  placeholder="e.g., RM-A: 50kg, RM-B: 20L"
                />
              </div>
              <Button onClick={handleAddProduction} className="w-full">
                Log Production
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{products.length}</div>
              <p className="text-xs text-muted-foreground">Active product lines</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Total Stock</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{getTotalProduction()}</div>
              <p className="text-xs text-muted-foreground">Units in inventory</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Low Stock Items</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{getLowStockCount()}</div>
              <p className="text-xs text-muted-foreground">Below minimum level</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Today's Production</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">150</div>
              <p className="text-xs text-muted-foreground">Units manufactured today</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-dark">Finished Goods Inventory</CardTitle>
            <CardDescription className="text-dark-secondary">
              Current stock levels and production details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">SKU</TableHead>
                  <TableHead className="font-semibold">Current Stock</TableHead>
                  <TableHead className="font-semibold">Min Stock</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Last Manufactured</TableHead>
                  <TableHead className="font-semibold">Batch No.</TableHead>
                  <TableHead className="font-semibold">Raw Materials Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-dark">{product.name}</TableCell>
                    <TableCell className="text-dark">{product.sku}</TableCell>
                    <TableCell className="text-dark">{product.currentStock} units</TableCell>
                    <TableCell className="text-dark">{product.minStock} units</TableCell>
                    <TableCell>
                      <Badge variant={product.currentStock < product.minStock ? "destructive" : "secondary"}>
                        {product.currentStock < product.minStock ? "Low Stock" : "In Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-dark">{product.manufactured}</TableCell>
                    <TableCell className="text-dark">{product.batchNo}</TableCell>
                    <TableCell className="max-w-xs truncate text-dark">{product.rawMaterialsUsed}</TableCell>
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
