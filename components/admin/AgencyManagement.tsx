import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShieldCheck, ShieldBan, ShieldAlert, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Mock Data
const MOCK_AGENCIES = [
  { id: "1", name: "Global Travel Experiences", email: "contact@gte.com", phone: "+1 555-0198", status: "ACTIVE", balance: 4500, applicationsCount: 12 },
  { id: "2", name: "Wanderlust Tours", email: "hello@wanderlust.com", phone: "+1 555-0245", status: "PENDING", balance: 0, applicationsCount: 0 },
  { id: "3", name: "Horizon Adventures", email: "info@horizon.net", phone: "+1 555-0371", status: "SUSPENDED", balance: 120, applicationsCount: 45 },
  { id: "4", name: "Oasis Travels", email: "bookings@oasistravels.com", phone: "+1 555-0455", status: "ACTIVE", balance: 18500, applicationsCount: 89 },
];

export function AgencyManagement() {
  const [agencies, setAgencies] = useState(MOCK_AGENCIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedAgency, setSelectedAgency] = useState<any>(null); // For detail/edit modal

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agency.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || agency.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Active</Badge>;
      case "PENDING": return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">Pending</Badge>;
      case "SUSPENDED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Suspended</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    setAgencies(agencies.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Agencies</h2>
        <Button className="bg-black text-white hover:bg-gray-800">Add Agency manually</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex w-full sm:w-1/2 gap-2">
          <Input 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <select 
            className="border-gray-200 rounded-md text-sm p-2 w-full sm:w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Agency Info</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Applications</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgencies.map((agency) => (
              <TableRow key={agency.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{agency.name}</div>
                  <div className="text-xs text-gray-500">ID: {agency.id}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{agency.email}</div>
                  <div className="text-xs text-gray-500">{agency.phone}</div>
                </TableCell>
                <TableCell>{getStatusBadge(agency.status)}</TableCell>
                <TableCell className="text-right font-mono font-medium">{agency.balance.toLocaleString()} DA</TableCell>
                <TableCell className="text-right text-gray-600">{agency.applicationsCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedAgency(agency)}>
                        <Eye className="mr-2 h-4 w-4 text-gray-500" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4 text-gray-500" /> Edit Info
                      </DropdownMenuItem>
                      <div className="h-px bg-gray-200 my-1"></div>
                      {agency.status === "PENDING" && (
                        <DropdownMenuItem onClick={() => updateStatus(agency.id, "ACTIVE")} className="text-green-600">
                          <ShieldCheck className="mr-2 h-4 w-4" /> Approve Registration
                        </DropdownMenuItem>
                      )}
                      {agency.status === "ACTIVE" && (
                        <DropdownMenuItem onClick={() => updateStatus(agency.id, "SUSPENDED")} className="text-amber-600">
                          <ShieldAlert className="mr-2 h-4 w-4" /> Suspend Agency
                        </DropdownMenuItem>
                      )}
                      {agency.status === "SUSPENDED" && (
                        <DropdownMenuItem onClick={() => updateStatus(agency.id, "ACTIVE")} className="text-green-600">
                          <ShieldCheck className="mr-2 h-4 w-4" /> Reactivate Agency
                        </DropdownMenuItem>
                      )}
                      {agency.status === "PENDING" && (
                        <DropdownMenuItem onClick={() => updateStatus(agency.id, "REJECTED")} className="text-red-600">
                          <ShieldBan className="mr-2 h-4 w-4" /> Reject Registration
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredAgencies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No agencies found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal Component (Inline for simplicity) */}
      <Dialog open={!!selectedAgency} onOpenChange={(o) => !o && setSelectedAgency(null)}>
        <DialogContent className="max-w-3xl">
          {selectedAgency && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{selectedAgency.name}</h3>
                  <p className="text-gray-500">{selectedAgency.email} • {selectedAgency.phone}</p>
                </div>
                {getStatusBadge(selectedAgency.status)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-500 font-medium">Current Balance</div>
                  <div className="text-3xl font-bold font-mono text-gray-900">{selectedAgency.balance.toLocaleString()} DA</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-500 font-medium">Total Applications</div>
                  <div className="text-3xl font-bold text-gray-900">{selectedAgency.applicationsCount}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
