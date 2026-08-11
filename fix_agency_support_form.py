import re

content = open('components/agency/AgencySupport.tsx').read()
if 'const [subject, setSubject] = useState("");' not in content:
    content = content.replace('const [selectedTicket, setSelectedTicket] = useState<any>(null);', 
    '''const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = () => {
    if (!subject || !description) return;
    addSupportTicket({
      agencyId: auth.currentUser?.uid || "mock-agency-id",
      agencyName: auth.currentUser?.email || "Mock Agency",
      subject,
      description,
      status: "OPEN",
      isUrgent,
      messages: []
    });
    setIsNewTicketOpen(false);
    setSubject("");
    setDescription("");
    setIsUrgent(false);
  };
''')

    # Replace inputs
    content = content.replace('<Input placeholder="Ex: Problème de paiement sur la demande VISA-123" className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white h-12" />',
    '<Input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Ex: Problème de paiement sur la demande VISA-123" className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white h-12" />')

    content = content.replace('<Textarea rows={6} placeholder="Décrivez votre problème en détail. Des captures d\'écran peuvent être attachées plus tard..." className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white resize-none" />',
    '<Textarea value={description} onChange={e=>setDescription(e.target.value)} rows={6} placeholder="Décrivez votre problème en détail. Des captures d\'écran peuvent être attachées plus tard..." className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white resize-none" />')

    content = content.replace('<input type="checkbox" id="urgent" className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300" />',
    '<input type="checkbox" id="urgent" checked={isUrgent} onChange={e=>setIsUrgent(e.target.checked)} className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300" />')

    # Fix submission button
    # Actually, we need to find the submit button. Let's look at the next few lines.
    open('components/agency/AgencySupport.tsx', 'w').write(content)

