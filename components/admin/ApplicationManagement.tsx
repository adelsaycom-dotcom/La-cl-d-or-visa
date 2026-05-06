import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, FileDown, CheckCircle, XCircle, AlertCircle, FileUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MOCK_APPLICATIONS = [
  { id: "APP-001", agency: "Wanderlust Tours", country: "United Arab Emirates", applicant: "John Doe", status: "PENDING", date: "2024-05-05", docs: 2 },
  { id: "APP-002", agency: "Global Travel Exp.", country: "Saudi Arabia", applicant: "Jane Smith", status: "IN_REVIEW", date: "2024-05-04", docs: 4 },
  { id: "APP-003", agency: "Oasis Travels", country: "Turkey", applicant: "Ali Benmoussa", status: "APPROVED", date: "2024-05-01", docs: 3, visaUrl: "/dummy/visa.pdf" },
  { id: "APP-004", agency: "Horizon Adventures", country: "Turkey", applicant: "Samir K.", status: "MISSING_DOCS", date: "2024-05-05", docs: 1 },
];

export function ApplicationManagement() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "PENDING": return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending</Badge>;
      case "IN_REVIEW": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Review</Badge>;
      case "MISSING_DOCS": return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Missing Docs</Badge>;
      case "REJECTED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const updateStatus = (newStatus: string) => {
    if (!selectedApp) return;
    setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, status: newStatus } : a));
    setSelectedApp({ ...selectedApp, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Visa Applications</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search applicant or agency..." className="w-full sm:max-w-xs" />
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="MISSING_DOCS">Missing Docs</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>ID / Date</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-mono text-sm font-medium">{app.id}</div>
                  <div className="text-xs text-gray-500">{app.date}</div>
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">{app.applicant}</TableCell>
                <TableCell className="text-gray-600 whitespace-nowrap">{app.agency}</TableCell>
                <TableCell className="whitespace-nowrap">{app.country}</TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>
                    <Eye className="w-4 h-4 mr-2" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Application Details: {selectedApp?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <div className="lg:col-span-2 space-y-6">
                {/* Applicant Info */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3 border-b pb-2">Applicant Information</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div><span className="text-gray-500 block text-xs">Full Name</span><span className="font-medium">{selectedApp.applicant}</span></div>
                    <div><span className="text-gray-500 block text-xs">Passport</span><span className="font-mono">AB123456</span></div>
                    <div><span className="text-gray-500 block text-xs">Nationality</span><span>French</span></div>
                    <div><span className="text-gray-500 block text-xs">DOB</span><span>1985-10-12</span></div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-semibold mb-3">Uploaded Documents ({selectedApp.docs})</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 flex justify-between items-center bg-white shadow-sm hover:border-blue-300 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded text-blue-600"><FileDown className="w-5 h-5" /></div>
                        <div className="text-sm font-medium">Passport Data Page</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 flex justify-between items-center bg-white shadow-sm hover:border-blue-300 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded text-blue-600"><FileDown className="w-5 h-5" /></div>
                        <div className="text-sm font-medium">Personal Photo</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Admin Note */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Notes (internal)</label>
                  <Textarea placeholder="Add notes here..." />
                  <Button variant="outline" size="sm">Save Note</Button>
                </div>
              </div>

              {/* Status Actions */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Current Status</h3>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2 uppercase font-medium">Change Status</p>
                    <Button onClick={() => updateStatus("IN_REVIEW")} variant="outline" className="w-full justify-start block" disabled={selectedApp.status === "IN_REVIEW"}>Set In Review</Button>
                    <Button onClick={() => updateStatus("MISSING_DOCS")} variant="outline" className="w-full justify-start block text-purple-600 hover:text-purple-700" disabled={selectedApp.status === "MISSING_DOCS"}>Request Missing Docs</Button>
                    <Button onClick={() => updateStatus("REJECTED")} variant="outline" className="w-full justify-start block text-red-600 hover:text-red-700 hover:bg-red-50 mt-4" disabled={selectedApp.status === "REJECTED"}><XCircle className="w-4 h-4 inline mr-2" /> Reject Application</Button>
                    <Button onClick={() => updateStatus("APPROVED")} className="w-full justify-start block bg-green-600 hover:bg-green-700 text-white mt-2" disabled={selectedApp.status === "APPROVED"}><CheckCircle className="w-4 h-4 inline mr-2" /> Approve Application</Button>
                  </div>
                </div>

                {selectedApp.status === "APPROVED" && (
                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Visa File</h4>
                    {!selectedApp.visaUrl ? (
                      <div className="border-2 border-dashed border-green-300 p-4 rounded-lg text-center cursor-pointer hover:bg-green-100 transition-colors">
                        <FileUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
                        <span className="text-sm font-medium text-green-700">Upload Final Visa PDF</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button className="w-full bg-green-600 text-white hover:bg-green-700"><FileDown className="w-4 h-4 mr-2" /> Download Attached Visa</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
