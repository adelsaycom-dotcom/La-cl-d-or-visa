const fs = require('fs');

let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

// We add passengers array state
content = content.replace(
  'const [customFormData, setCustomFormData] = useState<Record<string, string>>({});',
  `const [customFormData, setCustomFormData] = useState<Record<string, any>>({});
  const [passengers, setPassengers] = useState(Array.from({ length: 1 }, () => ({ firstName: '', lastName: '', passportNumber: '' })));`
);

// We need to update handleBook
content = content.replace(
  'await addTripReservation({',
  `await addTripReservation({
        passengerNames: passengers.map(p => p.firstName + ' ' + p.lastName),
        customFormData: { ...customFormData, passengers },`
);

// We need to update numberOfPeople change to rebuild passengers array safely
content = content.replace(
  '<Input type="number" min="1" max={selectedTrip?.availableSeats} value={numberOfPeople} onChange={e => setNumberOfPeople(Number(e.target.value))} />',
  `<Input type="number" min="1" max={selectedTrip?.availableSeats} value={numberOfPeople} onChange={e => {
                      const count = Number(e.target.value);
                      setNumberOfPeople(count);
                      setPassengers(prev => {
                        const newArr = [...prev];
                        if (count > newArr.length) {
                          for(let i = newArr.length; i < count; i++) {
                            newArr.push({ firstName: '', lastName: '', passportNumber: '' });
                          }
                        } else if (count < newArr.length) {
                          return newArr.slice(0, count);
                        }
                        return newArr;
                      });
                    }} />`
);

fs.writeFileSync('components/agency/OrganizedTrips.tsx', content);
