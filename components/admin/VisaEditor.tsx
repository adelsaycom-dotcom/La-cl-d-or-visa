import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisaFormBuilder, FormField } from "./VisaFormBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function VisaEditor({ countryId, onSave, onCancel }: { countryId: string, onSave: () => void, onCancel: () => void }) {
  const [fields, setFields] = useState<FormField[]>([]);
  const [reqDocs, setReqDocs] = useState<string[]>(["Passport Copy"]);

  const [generalInfo, setGeneralInfo] = useState({
    name: "Tourist Visa",
    price: 150,
    duration: "30 days",
    validity: "90 days",
    processingTime: "3-5 business days",
    isActive: true,
  });

  const [conditions, setConditions] = useState("• Must have return ticket\n• Passport valid 6 months");

  const addDoc = () => setReqDocs([...reqDocs, "New Document"]);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Edit Visa Type</h2>
        <div className="flex items-center gap-2">
          <Switch checked={generalInfo.isActive} onCheckedChange={c => setGeneralInfo({ ...generalInfo, isActive: c })} />
          <Label>Active</Label>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="documents">Required Docs</TabsTrigger>
          <TabsTrigger value="form">Dynamic Form Config</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Visa Name</Label><Input value={generalInfo.name} onChange={e => setGeneralInfo({...generalInfo, name: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Price (DA)</Label><Input type="number" value={generalInfo.price} onChange={e => setGeneralInfo({...generalInfo, price: Number(e.target.value)})} /></div>
            <div className="space-y-1.5"><Label>Stay Duration</Label><Input value={generalInfo.duration} onChange={e => setGeneralInfo({...generalInfo, duration: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Validity</Label><Input value={generalInfo.validity} onChange={e => setGeneralInfo({...generalInfo, validity: e.target.value})} /></div>
            <div className="space-y-1.5"><Label>Processing Time</Label><Input value={generalInfo.processingTime} onChange={e => setGeneralInfo({...generalInfo, processingTime: e.target.value})} /></div>
          </div>
          <div className="space-y-1.5">
            <Label>Conditions (Markdown/Text)</Label>
            <Textarea rows={4} value={conditions} onChange={e => setConditions(e.target.value)} />
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-3">
            {reqDocs.map((doc, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={doc} onChange={e => {
                  const newDocs = [...reqDocs];
                  newDocs[i] = e.target.value;
                  setReqDocs(newDocs);
                }} />
                <Button variant="ghost" className="text-red-500" onClick={() => setReqDocs(reqDocs.filter((_, idx) => idx !== i))}>Delete</Button>
              </div>
            ))}
            <Button variant="outline" onClick={addDoc}>+ Add Required Document</Button>
          </div>
        </TabsContent>

        <TabsContent value="form">
          <p className="text-sm text-gray-500 mb-4">
            Define the fields that the applicant must fill out when applying for this visa.
          </p>
          <VisaFormBuilder fields={fields} onChange={setFields} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} className="bg-black text-white px-8">Save Visa Type</Button>
      </div>
    </div>
  );
}
