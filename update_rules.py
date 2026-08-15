import re

with open('firestore.rules', 'r') as f:
    content = f.read()

notif_rules = """
    match /notifications/{notifId} {
      allow read: if isSignedIn() && (isAdmin() || existing().agencyId == request.auth.uid);
      allow create: if isAdmin() || (isAgency() && incoming().agencyId == request.auth.uid);
      allow update: if isAdmin() || (isAgency() && existing().agencyId == request.auth.uid && incoming().read == true);
      allow delete: if isAdmin() || (isAgency() && existing().agencyId == request.auth.uid);
    }
  }
}"""

content = content.replace("  }\n}", notif_rules)

with open('firestore.rules', 'w') as f:
    f.write(content)
