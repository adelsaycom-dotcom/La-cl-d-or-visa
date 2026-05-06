import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, GripVertical, Plus } from "lucide-react";

export type FieldType = "text" | "date" | "select" | "number" | "checkbox";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select type
}

export function VisaFormBuilder({ 
  fields, 
  onChange 
}: { 
  fields: FormField[], 
  onChange: (fields: FormField[]) => void 
}) {
  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      name: `field_${Date.now()}`,
      label: `New ${type} field`,
      type,
      required: true,
      options: type === "select" ? ["Option 1"] : undefined,
    };
    onChange([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    onChange(fields.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 items-center">
        <span className="text-sm font-medium flex items-center mr-2 text-gray-500">Add Field:</span>
        <Button variant="outline" size="sm" onClick={() => addField("text")}>Text</Button>
        <Button variant="outline" size="sm" onClick={() => addField("number")}>Number</Button>
        <Button variant="outline" size="sm" onClick={() => addField("date")}>Date</Button>
        <Button variant="outline" size="sm" onClick={() => addField("select")}>Dropdown</Button>
        <Button variant="outline" size="sm" onClick={() => addField("checkbox")}>Checkbox</Button>
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
            No fields added yet. Application form will be empty.
          </div>
        ) : fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm group">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <GripVertical className="text-gray-400 mt-2 cursor-move hidden sm:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-1.5">
                  <Label>Label (Displayed to user)</Label>
                  <Input 
                    value={field.label} 
                    onChange={e => updateField(field.id, { label: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label>Internal Key (db name)</Label>
                  <Input 
                    value={field.name} 
                    onChange={e => updateField(field.id, { name: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 sm:mt-8 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={field.required} 
                    onCheckedChange={c => updateField(field.id, { required: c })}
                  />
                  <Label className="text-sm text-gray-600">Required</Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {field.type === "select" && (
              <div className="pl-10 space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Dropdown Options (comma separated)</Label>
                <Input 
                  value={field.options?.join(", ")} 
                  onChange={e => updateField(field.id, { options: e.target.value.split(",").map(s => s.trim()) })}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
