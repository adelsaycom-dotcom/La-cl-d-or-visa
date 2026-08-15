import re

with open('components/agency/VisaWizard.tsx', 'r') as f:
    content = f.read()

# Replace setAgencyBalance(agencyBalance - price);
content = re.sub(r'setAgencyBalance\(agencyBalance - price\);\s*', '', content)

# Make handleSubmit async and handle errors
handle_submit_old = r"""  const handleSubmit = \(\) => {
    const price = selectedVisa\?\.price \|\| 0;
    addApplication\(\{"""

handle_submit_new = """  const handleSubmit = async () => {
    const price = selectedVisa?.price || 0;
    try {
      await addApplication({"""

content = content.replace(handle_submit_old, handle_submit_new)

handle_submit_end_old = r"""      \},
    \}\);
    alert\("Demande soumise avec succès !"\);
    navigate\("/agency/applications"\);
  \};"""

handle_submit_end_new = """      },
      });
      alert("Demande soumise avec succès !");
      navigate("/agency/applications");
    } catch (err: any) {
      alert("Erreur lors de la soumission : " + (err.message || "Solde insuffisant ou erreur réseau."));
    }
  };"""

content = re.sub(handle_submit_end_old, handle_submit_end_new, content)

with open('components/agency/VisaWizard.tsx', 'w') as f:
    f.write(content)
