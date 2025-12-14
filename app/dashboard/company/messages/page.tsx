"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/dashboard/Topbar";
import { Mail, User, Users, Calendar, MessageSquare, MapPin } from "lucide-react";

interface Contact {
  _id: string;
  guideId: string;
  guideName?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  message: string;
  preferredDate?: string;
  groupSize: number;
  hikeInterest?: string;
  status: string;
  createdAt: string;
}

export default function CompanyMessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchContacts() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Get user info
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: tokenPayload.name || "Company" });

        const res = await fetch("/api/guides/contact", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          setContacts(data.contacts || []);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  const filteredContacts = filter === "all" 
    ? contacts 
    : contacts.filter(c => c.status === filter);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="p-8 pt-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Messages & Contact Requests</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage inquiries from potential clients about your guides
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All ({contacts.length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
            >
              Pending ({contacts.filter(c => c.status === "pending").length})
            </Button>
            <Button
              variant={filter === "contacted" ? "default" : "outline"}
              onClick={() => setFilter("contacted")}
            >
              Contacted ({contacts.filter(c => c.status === "contacted").length})
            </Button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading messages...</p>
            </div>
          )}

          {!loading && filteredContacts.length === 0 && (
            <Card className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
              <p className="text-gray-600">
                {filter === "all" 
                  ? "Contact requests from clients will appear here."
                  : `No ${filter} messages found.`}
              </p>
            </Card>
          )}

          {!loading && filteredContacts.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {filteredContacts.map((contact) => (
                <Card key={contact._id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{contact.clientName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.clientEmail}
                          </span>
                          {contact.clientPhone && (
                            <span>{contact.clientPhone}</span>
                          )}
                        </div>
                        {contact.guideName && (
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Guide:</span> {contact.guideName}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {contact.groupSize && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {contact.groupSize} {contact.groupSize === 1 ? "person" : "people"}
                        </span>
                      </div>
                    )}
                    {contact.preferredDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(contact.preferredDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {contact.hikeInterest && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{contact.hikeInterest}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={() => window.location.href = `mailto:${contact.clientEmail}`}
                    >
                      Reply via Email
                    </Button>
                    {contact.clientPhone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `tel:${contact.clientPhone}`}
                      >
                        Call
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
