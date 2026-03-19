"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  House,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  SquarePen,
  Trash2,
  UtensilsCrossed,
  Sparkles,
  Tags,
} from "lucide-react";

import { apiClient } from "@/services/api-client";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminTab = "overview" | "foods" | "combos" | "signature";

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

type AdminMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
  tags: string[];
  categoryId: string;
  category: string;
  categoryName: string;
};

type ComboOffer = {
  id: string;
  name: string;
  details: string;
  price: number;
  image: string;
  sortOrder: number;
  isActive: boolean;
};

type SignatureItem = {
  id: string;
  menuItemId: string;
  sortOrder: number;
  isActive: boolean;
  menuItem: {
    id: string;
    name: string;
    category: string;
    categoryName: string;
    price: number;
    image: string;
  };
};

type FoodFormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  tags: string;
  featured: boolean;
  available: boolean;
};

type ComboFormState = {
  name: string;
  details: string;
  price: string;
  image: string;
  sortOrder: string;
  isActive: boolean;
};

type SignatureFormState = {
  menuItemId: string;
  sortOrder: string;
  isActive: boolean;
};

const navItems: Array<{ key: AdminTab; label: string; icon: React.ElementType }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "foods", label: "Food Management", icon: UtensilsCrossed },
  { key: "combos", label: "Combo Offers", icon: Tags },
  { key: "signature", label: "Hero Signature", icon: Sparkles },
];

const emptyFoodForm: FoodFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  categoryId: "",
  tags: "",
  featured: false,
  available: true,
};

const emptyComboForm: ComboFormState = {
  name: "",
  details: "",
  price: "",
  image: "",
  sortOrder: "0",
  isActive: true,
};

const emptySignatureForm: SignatureFormState = {
  menuItemId: "",
  sortOrder: "0",
  isActive: true,
};

export default function DashboardScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>([]);
  const [signatureItems, setSignatureItems] = useState<SignatureItem[]>([]);

  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [foodForm, setFoodForm] = useState<FoodFormState>(emptyFoodForm);
  const [imageUploading, setImageUploading] = useState(false);

  const [comboDialogOpen, setComboDialogOpen] = useState(false);
  const [editingComboId, setEditingComboId] = useState<string | null>(null);
  const [comboForm, setComboForm] = useState<ComboFormState>(emptyComboForm);

  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [editingSignatureId, setEditingSignatureId] = useState<string | null>(null);
  const [signatureForm, setSignatureForm] = useState<SignatureFormState>(emptySignatureForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesRes, menuRes, combosRes, signatureRes] = await Promise.all([
        apiClient.get<{ data: AdminCategory[] }>("/admin/categories"),
        apiClient.get<{ data: AdminMenuItem[] }>("/admin/menu-items"),
        apiClient.get<{ data: ComboOffer[] }>("/admin/home/combo-offers"),
        apiClient.get<{ data: SignatureItem[] }>("/admin/home/signature-items"),
      ]);

      setCategories(categoriesRes.data.data || []);
      setMenuItems(menuRes.data.data || []);
      setComboOffers(combosRes.data.data || []);
      setSignatureItems(signatureRes.data.data || []);
    } catch {
      setMessage("ডেটা লোড করতে সমস্যা হয়েছে। আবার রিফ্রেশ করুন।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const stats = useMemo(
    () => [
      {
        label: "Total Foods",
        value: String(menuItems.length),
        helper: `${menuItems.filter((item) => item.available).length} available`,
      },
      {
        label: "Out Of Stock",
        value: String(menuItems.filter((item) => !item.available).length),
        helper: "Need restock/update",
      },
      {
        label: "Active Combo Offers",
        value: String(comboOffers.filter((offer) => offer.isActive).length),
        helper: `${comboOffers.length} total combos`,
      },
      {
        label: "Hero Signature Items",
        value: String(signatureItems.filter((item) => item.isActive).length),
        helper: `${signatureItems.length} configured`,
      },
    ],
    [menuItems, comboOffers, signatureItems],
  );

  const openCreateFood = () => {
    setEditingFoodId(null);
    setFoodForm({ ...emptyFoodForm, categoryId: categories[0]?.id || "" });
    setFoodDialogOpen(true);
  };

  const openEditFood = (item: AdminMenuItem) => {
    setEditingFoodId(item.id);
    setFoodForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      image: item.image,
      categoryId: item.categoryId,
      tags: item.tags.join(", "),
      featured: item.featured,
      available: item.available,
    });
    setFoodDialogOpen(true);
  };

  const saveFood = async () => {
    if (!foodForm.name.trim() || !foodForm.description.trim() || !foodForm.price || !foodForm.image.trim() || !foodForm.categoryId) {
      setMessage("Food form এর required field পূরণ করুন।");
      return;
    }

    const payload = {
      name: foodForm.name.trim(),
      description: foodForm.description.trim(),
      price: Number(foodForm.price),
      image: foodForm.image.trim(),
      categoryId: foodForm.categoryId,
      tags: foodForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      featured: foodForm.featured,
      available: foodForm.available,
    };

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      setMessage("Price valid number দিন।");
      return;
    }

    setSaving(true);
    try {
      if (editingFoodId) {
        await apiClient.patch(`/admin/menu-items/${editingFoodId}`, payload);
        setMessage("Food updated successfully.");
      } else {
        await apiClient.post("/admin/menu-items", payload);
        setMessage("Food added successfully.");
      }
      setFoodDialogOpen(false);
      await loadData();
    } catch {
      setMessage("Food save করা যায়নি।");
    } finally {
      setSaving(false);
    }
  };

  const uploadFoodImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage("শুধু image file upload করতে পারবেন।");
      return;
    }

    setImageUploading(true);
    try {
      const signRes = await apiClient.post<{
        timestamp: number;
        folder: string;
        signature: string;
        cloudName: string;
        apiKey: string;
      }>("/admin/uploads/signature");

      const { timestamp, folder, signature, cloudName, apiKey } = signRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("signature", signature);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        setMessage("Image upload failed. আবার চেষ্টা করুন।");
        return;
      }

      const uploaded = await uploadRes.json() as { secure_url?: string };
      if (!uploaded.secure_url) {
        setMessage("Image URL পাওয়া যায়নি।");
        return;
      }

      setFoodForm((prev) => ({ ...prev, image: uploaded.secure_url || "" }));
      setMessage("Image uploaded successfully.");
    } catch {
      setMessage("Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleFoodImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadFoodImage(file);
    event.target.value = "";
  };

  const deleteFood = async (id: string) => {
    const ok = window.confirm("এই food item delete করতে চান?");
    if (!ok) return;

    setSaving(true);
    try {
      await apiClient.delete(`/admin/menu-items/${id}`);
      setMessage("Food deleted.");
      await loadData();
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(error.response?.data?.message || "Food delete failed.");
      } else {
        setMessage("Food delete failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleFoodAvailability = async (item: AdminMenuItem) => {
    setSaving(true);
    try {
      await apiClient.patch(`/admin/menu-items/${item.id}`, { available: !item.available });
      setMessage(item.available ? "Food marked as out of stock." : "Food marked as available.");
      await loadData();
    } catch {
      setMessage("Stock status update failed.");
    } finally {
      setSaving(false);
    }
  };

  const openCreateCombo = () => {
    setEditingComboId(null);
    setComboForm(emptyComboForm);
    setComboDialogOpen(true);
  };

  const openEditCombo = (combo: ComboOffer) => {
    setEditingComboId(combo.id);
    setComboForm({
      name: combo.name,
      details: combo.details,
      price: String(combo.price),
      image: combo.image,
      sortOrder: String(combo.sortOrder),
      isActive: combo.isActive,
    });
    setComboDialogOpen(true);
  };

  const saveCombo = async () => {
    if (!comboForm.name.trim() || !comboForm.details.trim() || !comboForm.price || !comboForm.image.trim()) {
      setMessage("Combo form এর required field পূরণ করুন।");
      return;
    }

    const payload = {
      name: comboForm.name.trim(),
      details: comboForm.details.trim(),
      price: Number(comboForm.price),
      image: comboForm.image.trim(),
      sortOrder: Number(comboForm.sortOrder || "0"),
      isActive: comboForm.isActive,
    };

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      setMessage("Combo price valid number দিন।");
      return;
    }

    setSaving(true);
    try {
      if (editingComboId) {
        await apiClient.patch(`/admin/home/combo-offers/${editingComboId}`, payload);
        setMessage("Combo updated.");
      } else {
        await apiClient.post("/admin/home/combo-offers", payload);
        setMessage("Combo added.");
      }
      setComboDialogOpen(false);
      await loadData();
    } catch {
      setMessage("Combo save failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCombo = async (id: string) => {
    const ok = window.confirm("এই combo offer delete করতে চান?");
    if (!ok) return;

    setSaving(true);
    try {
      await apiClient.delete(`/admin/home/combo-offers/${id}`);
      setMessage("Combo deleted.");
      await loadData();
    } catch {
      setMessage("Combo delete failed.");
    } finally {
      setSaving(false);
    }
  };

  const openCreateSignature = () => {
    setEditingSignatureId(null);
    setSignatureForm({ ...emptySignatureForm, menuItemId: menuItems[0]?.id || "" });
    setSignatureDialogOpen(true);
  };

  const openEditSignature = (item: SignatureItem) => {
    setEditingSignatureId(item.id);
    setSignatureForm({
      menuItemId: item.menuItemId,
      sortOrder: String(item.sortOrder),
      isActive: item.isActive,
    });
    setSignatureDialogOpen(true);
  };

  const saveSignature = async () => {
    if (!signatureForm.menuItemId) {
      setMessage("একটি food select করুন।");
      return;
    }

    const payload = {
      menuItemId: signatureForm.menuItemId,
      sortOrder: Number(signatureForm.sortOrder || "0"),
      isActive: signatureForm.isActive,
    };

    setSaving(true);
    try {
      if (editingSignatureId) {
        await apiClient.patch(`/admin/home/signature-items/${editingSignatureId}`, payload);
        setMessage("Signature item updated.");
      } else {
        await apiClient.post("/admin/home/signature-items", payload);
        setMessage("Signature item added.");
      }
      setSignatureDialogOpen(false);
      await loadData();
    } catch {
      setMessage("Signature item save failed. একই food একাধিকবার add করা যাবে না।");
    } finally {
      setSaving(false);
    }
  };

  const deleteSignature = async (id: string) => {
    const ok = window.confirm("এই signature item delete করতে চান?");
    if (!ok) return;

    setSaving(true);
    try {
      await apiClient.delete(`/admin/home/signature-items/${id}`);
      setMessage("Signature item deleted.");
      await loadData();
    } catch {
      setMessage("Signature item delete failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.replace("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-cream via-background to-background">
      <div className="container py-8 md:py-12">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Dashboard Control Center</h1>
              <p className="mt-1 text-sm text-muted-foreground">Food, combo offers, hero signature items এবং stock status এক জায়গা থেকে manage করুন।</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="secondary">
                <Link href="/">
                  <House className="h-4 w-4" /> Back Home
                </Link>
              </Button>
              <Button variant="secondary" onClick={() => void loadData()} disabled={loading || saving || loggingOut}>
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
              <Button variant="secondary" onClick={() => void handleLogout()} disabled={loggingOut} className="border-destructive/40 text-destructive">
                <LogOut className="h-4 w-4" /> {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={tab === item.key ? "primary" : "secondary"}
                onClick={() => setTab(item.key)}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Button>
            ))}
          </div>

          {message ? (
            <div className="mt-5 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
              {message}
            </div>
          ) : null}

          {tab === "overview" ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "foods" ? (
            <div className="mt-6 rounded-xl border border-border bg-background">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Food Management</h2>
                  <p className="text-sm text-muted-foreground">Add, edit, delete এবং stock mark করুন।</p>
                </div>
                <Button onClick={openCreateFood}><Plus className="h-4 w-4" /> Add Food</Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      <th className="px-4 py-3">Food</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.categoryName}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => void toggleFoodAvailability(item)}
                            disabled={saving}
                            className={item.available ? "border-success/40 text-success" : "border-destructive/40 text-destructive"}
                          >
                            {item.available ? "In Stock" : "Out Of Stock"}
                          </Button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openEditFood(item)}>
                              <SquarePen className="h-4 w-4" /> Edit
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => void deleteFood(item.id)} className="border-destructive/40 text-destructive">
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!loading && menuItems.length === 0 ? (
                      <tr>
                        <td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>No food items found.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "combos" ? (
            <div className="mt-6 rounded-xl border border-border bg-background">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Combo Offers</h2>
                  <p className="text-sm text-muted-foreground">Homepage combo section update করুন।</p>
                </div>
                <Button onClick={openCreateCombo}><Plus className="h-4 w-4" /> Add Combo</Button>
              </div>

              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                {comboOffers.map((offer) => (
                  <div key={offer.id} className="overflow-hidden rounded-xl border border-border bg-card">
                    <img src={offer.image} alt={offer.name} className="h-36 w-full object-cover" />
                    <div className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-foreground">{offer.name}</h3>
                        <span className="rounded-md bg-muted px-2 py-1 text-xs">#{offer.sortOrder}</span>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{offer.details}</p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="font-semibold text-foreground">{formatCurrency(offer.price)}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${offer.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                          {offer.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" variant="secondary" onClick={() => openEditCombo(offer)}>
                          <SquarePen className="h-4 w-4" /> Edit
                        </Button>
                        <Button size="sm" variant="secondary" className="border-destructive/40 text-destructive" onClick={() => void deleteCombo(offer.id)}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {!loading && comboOffers.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No combo offer yet.</div>
                ) : null}
              </div>
            </div>
          ) : null}

          {tab === "signature" ? (
            <div className="mt-6 rounded-xl border border-border bg-background">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Today Signature Hero</h2>
                  <p className="text-sm text-muted-foreground">Hero section এর signature food add/edit/delete করুন।</p>
                </div>
                <Button onClick={openCreateSignature}><Plus className="h-4 w-4" /> Add Signature Food</Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                      <th className="px-4 py-3">Food</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signatureItems.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground">{item.menuItem.name}</p>
                          <p className="text-xs text-muted-foreground">#{item.menuItem.id}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.menuItem.categoryName}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(item.menuItem.price)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.sortOrder}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${item.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openEditSignature(item)}>
                              <SquarePen className="h-4 w-4" /> Edit
                            </Button>
                            <Button size="sm" variant="secondary" className="border-destructive/40 text-destructive" onClick={() => void deleteSignature(item.id)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!loading && signatureItems.length === 0 ? (
                      <tr>
                        <td className="px-4 py-8 text-center text-muted-foreground" colSpan={6}>No signature item configured yet.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Dialog open={foodDialogOpen} onOpenChange={setFoodDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFoodId ? "Edit Food" : "Add Food"}</DialogTitle>
            <DialogDescription>Food details update করলে menu ও homepage data refresh হবে।</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div>
              <Label>Name</Label>
              <Input value={foodForm.name} onChange={(event) => setFoodForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={foodForm.description} onChange={(event) => setFoodForm((prev) => ({ ...prev, description: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price</Label>
                <Input type="number" min="0" step="0.01" value={foodForm.price} onChange={(event) => setFoodForm((prev) => ({ ...prev, price: event.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={foodForm.categoryId} onValueChange={(value) => setFoodForm((prev) => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Food Image</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor="food-image-upload" className="sr-only">Upload food image</Label>
                <Input
                  id="food-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    void handleFoodImageFileChange(event);
                  }}
                  className="max-w-xs"
                  disabled={imageUploading || saving}
                />
                {imageUploading ? <p className="text-xs text-muted-foreground">Uploading image...</p> : null}
              </div>
              {foodForm.image ? <p className="text-xs text-muted-foreground">Image ready for save.</p> : <p className="text-xs text-muted-foreground">Please upload an image.</p>}
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input value={foodForm.tags} onChange={(event) => setFoodForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder="popular, spicy, premium" />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-xs text-muted-foreground">Homepage featured section এ দেখাবে।</p>
              </div>
              <Switch checked={foodForm.featured} onCheckedChange={(checked) => setFoodForm((prev) => ({ ...prev, featured: checked }))} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">Available In Stock</p>
                <p className="text-xs text-muted-foreground">Out of stock mark করতে off করুন।</p>
              </div>
              <Switch checked={foodForm.available} onCheckedChange={(checked) => setFoodForm((prev) => ({ ...prev, available: checked }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setFoodDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void saveFood()} disabled={saving || imageUploading}>{editingFoodId ? "Save Changes" : "Create Food"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={comboDialogOpen} onOpenChange={setComboDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingComboId ? "Edit Combo Offer" : "Add Combo Offer"}</DialogTitle>
            <DialogDescription>Homepage combo section dynamicভাবে update হবে।</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div>
              <Label>Name</Label>
              <Input value={comboForm.name} onChange={(event) => setComboForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div>
              <Label>Details</Label>
              <Textarea value={comboForm.details} onChange={(event) => setComboForm((prev) => ({ ...prev, details: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price</Label>
                <Input type="number" min="0" step="0.01" value={comboForm.price} onChange={(event) => setComboForm((prev) => ({ ...prev, price: event.target.value }))} />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" min="0" value={comboForm.sortOrder} onChange={(event) => setComboForm((prev) => ({ ...prev, sortOrder: event.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={comboForm.image} onChange={(event) => setComboForm((prev) => ({ ...prev, image: event.target.value }))} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">Inactive combo homepage-এ দেখাবে না।</p>
              </div>
              <Switch checked={comboForm.isActive} onCheckedChange={(checked) => setComboForm((prev) => ({ ...prev, isActive: checked }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setComboDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void saveCombo()} disabled={saving}>{editingComboId ? "Save Changes" : "Create Combo"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSignatureId ? "Edit Signature Item" : "Add Signature Item"}</DialogTitle>
            <DialogDescription>Hero section এর আজকের signature list manage করুন।</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div>
              <Label>Food Item</Label>
              <Select value={signatureForm.menuItemId} onValueChange={(value) => setSignatureForm((prev) => ({ ...prev, menuItemId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select food" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name} ({item.categoryName})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" min="0" value={signatureForm.sortOrder} onChange={(event) => setSignatureForm((prev) => ({ ...prev, sortOrder: event.target.value }))} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">Inactive item hero-তে দেখাবে না।</p>
              </div>
              <Switch checked={signatureForm.isActive} onCheckedChange={(checked) => setSignatureForm((prev) => ({ ...prev, isActive: checked }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setSignatureDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void saveSignature()} disabled={saving}>{editingSignatureId ? "Save Changes" : "Add Signature"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
