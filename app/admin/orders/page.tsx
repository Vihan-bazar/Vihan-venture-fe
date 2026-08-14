"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { PackagePlus, LogOut, LayoutDashboard, Search, ShoppingBag, Clock, Truck, CheckCircle, ChevronDown, Package } from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
    _id: string;
    product: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    _id: string;
    orderId: string;
    customerDetails: {
        name: string;
        phone: string;
        address: string;
        city: string;
        pinCode: string;
    };
    paymentMethod: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'Pending' | 'Dispatched' | 'Delivered';
    createdAt: string;
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        // SECURITY CHECK: Verify admin is logged in
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            // Update local state instantly
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, status: newStatus as any } : order
            ));
        } catch (error) {
            console.error("Failed to update status");
            alert("Error updating order status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = orders.filter(order => 
        order.orderId.includes(searchQuery) || 
        order.customerDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerDetails.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const dispatchedCount = orders.filter(o => o.status === 'Dispatched').length;

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans relative">
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-30"></div>
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-md p-6 hidden md:flex flex-col justify-between z-10 shrink-0">
                <div>
                    <div className="mb-12">
                        <h1 className="text-2xl font-bold tracking-wider">
                            Vihan <span className="text-blue-500">Venture</span>
                        </h1>
                        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Workspace</p>
                    </div>
                    <nav className="space-y-2">
                        <button onClick={() => router.push('/admin/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <LayoutDashboard size={18} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </button>
                        <button onClick={() => router.push('/admin/inventory')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <PackagePlus size={18} />
                            <span className="font-medium text-sm">Add Inventory</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl transition-all border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            <ShoppingBag size={18} />
                            <span className="font-medium text-sm">Manage Orders</span>
                        </button>
                    </nav>
                </div>
                
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative z-10 w-full">
                <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
                    
                    {/* Mobile Header */}
                    <header className="mb-8 flex justify-between items-center md:hidden">
                        <h1 className="text-xl font-bold">Vihan <span className="text-blue-500">Venture</span></h1>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white"><LogOut size={20} /></button>
                    </header>

                    {/* Header & Search */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Order Management</h2>
                            <p className="text-sm md:text-base text-gray-400 mt-2">Track, update, and fulfill incoming customer purchases.</p>
                        </div>
                        
                        <div className="relative group w-full lg:w-80">
                            <Search className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by Order ID, Name, or City..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 text-sm shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-xl flex items-center gap-4 md:gap-5 relative overflow-hidden group">
                            <div className="p-3 md:p-4 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20 relative z-10">
                                <Clock size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Action Required</p>
                                <p className="text-2xl md:text-3xl font-semibold text-white">{pendingCount} <span className="text-sm text-gray-500 font-medium">Pending</span></p>
                            </div>
                        </div>
                        
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-xl flex items-center gap-4 md:gap-5 relative overflow-hidden group">
                            <div className="p-3 md:p-4 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 relative z-10">
                                <Truck size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">In Transit</p>
                                <p className="text-2xl md:text-3xl font-semibold text-white">{dispatchedCount} <span className="text-sm text-gray-500 font-medium">Dispatched</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-gray-500">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                            Loading orders...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center text-gray-500 backdrop-blur-md">
                            <Package size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium text-gray-400">No orders found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => (
                                <motion.div 
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col xl:flex-row gap-6 xl:gap-10 transition-all hover:border-white/10"
                                >
                                    {/* Order Details Column */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-bold text-white">Order #{order.orderId}</h3>
                                                    {order.status === 'Pending' && <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">Pending</span>}
                                                    {order.status === 'Dispatched' && <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">Dispatched</span>}
                                                    {order.status === 'Delivered' && <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">Delivered</span>}
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-semibold text-blue-400">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                                <p className="text-xs text-gray-500 font-medium mt-1 uppercase">{order.paymentMethod}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            {/* Customer Info */}
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h4>
                                                <p className="font-medium text-gray-200 mb-1">{order.customerDetails.name}</p>
                                                <p className="text-sm text-gray-400">{order.customerDetails.phone}</p>
                                                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                                    {order.customerDetails.address}<br/>
                                                    {order.customerDetails.city}, {order.customerDetails.pinCode}
                                                </p>
                                            </div>

                                            {/* Action / Status Update */}
                                            <div className="md:border-l md:border-white/5 md:pl-6">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fulfillment Action</h4>
                                                <div className="relative">
                                                    <select 
                                                        disabled={updatingId === order._id}
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        className="w-full appearance-none bg-black/50 border border-white/10 text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <option value="Pending">Mark as Pending</option>
                                                        <option value="Dispatched">Mark as Dispatched</option>
                                                        <option value="Delivered">Mark as Delivered</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                                {updatingId === order._id && <p className="text-xs text-blue-400 mt-2 animate-pulse">Updating status...</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items Column */}
                                    <div className="xl:w-80 shrink-0 bg-black/20 rounded-2xl p-5 border border-white/5">
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Order Items</h4>
                                        <div className="space-y-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <div className="w-12 h-16 bg-black/40 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-200 line-clamp-1">{item.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 rounded text-gray-300">Size: {item.size}</span>
                                                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}