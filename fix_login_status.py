import re

content = open('components/auth/Login.tsx').read()

pattern = r'''if \(role === 'admin'\) \{\s*navigate\("/admin"\);\s*\} else \{\s*navigate\("/agency"\);\s*\}'''
replacement = r'''if (role === 'admin') {
          navigate("/admin");
        } else {
          const status = userDoc.data().status;
          if (status === 'PENDING') {
            alert("Votre compte est en attente de validation par l'administrateur.");
            // auth.signOut(); // optional
          } else if (status === 'SUSPENDED') {
            alert("Votre compte a été suspendu. Veuillez contacter le support.");
          } else {
            navigate("/agency");
          }
        }'''

content = re.sub(pattern, replacement, content)
open('components/auth/Login.tsx', 'w').write(content)
