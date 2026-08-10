import re

for f in ['components/auth/Login.tsx', 'components/auth/Register.tsx']:
    content = open(f).read()
    
    # We will replace setError(err.message) with a more helpful one
    pattern = r'setError\(err\.message\);'
    replacement = r'''if (err.code === "auth/operation-not-allowed") {
        setError("L\'authentification par email/mot de passe n\'est pas activée sur Firebase. Veuillez l\'activer dans la console Firebase (Authentication > Sign-in method).");
      } else {
        setError("Email ou mot de passe incorrect.");
      }'''
      
    content = re.sub(pattern, replacement, content)
    open(f, 'w').write(content)

