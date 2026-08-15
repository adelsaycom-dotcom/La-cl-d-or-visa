import re

with open('components/agency/OrganizedTrips.tsx', 'r') as f:
    content = f.read()

handle_book_old = r"""  const handleBook = \(\) => {
    if \(selectedTrip && clientName && numberOfPeople > 0\) \{
      addTripReservation\(\{"""

handle_book_new = """  const handleBook = async () => {
    if (selectedTrip && clientName && numberOfPeople > 0) {
      try {
        await addTripReservation({"""

content = re.sub(handle_book_old, handle_book_new, content)

handle_book_end_old = r"""        customFormData
      \}\);
      setIsBookingOpen\(false\);"""

handle_book_end_new = """        customFormData
        });
        setIsBookingOpen(false);"""

content = re.sub(handle_book_end_old, handle_book_end_new, content)

handle_book_finish_old = r"""      setCustomFormData\(\{\}\);
      // Optionally show success toast here
      alert\('Réservation effectuée avec succès !'\);
    \}
  \};"""

handle_book_finish_new = """      setCustomFormData({});
        // Optionally show success toast here
        alert('Réservation effectuée avec succès !');
      } catch (err: any) {
        alert("Erreur : " + (err.message || "Solde insuffisant ou erreur serveur."));
      }
    }
  };"""

content = re.sub(handle_book_finish_old, handle_book_finish_new, content)

with open('components/agency/OrganizedTrips.tsx', 'w') as f:
    f.write(content)
