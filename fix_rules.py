import re

with open('firestore.rules', 'r') as f:
    content = f.read()

old_notif_rule = r"""    match /notifications/\{notifId\} \{
      allow read: if isSignedIn\(\) && \(isAdmin\(\) \|\| existing\(\)\.agencyId == request\.auth\.uid\);
      allow create: if isAdmin\(\) \|\| \(isAgency\(\) && incoming\(\)\.agencyId == request\.auth\.uid\);
      allow update: if isAdmin\(\) \|\| \(isAgency\(\) && existing\(\)\.agencyId == request\.auth\.uid && incoming\(\)\.read == true\);
      allow delete: if isAdmin\(\) \|\| \(isAgency\(\) && existing\(\)\.agencyId == request\.auth\.uid\);
    \}"""

new_notif_rule = """    match /notifications/{notifId} {
      allow read: if isSignedIn() && (isAdmin() || existing().agencyId == request.auth.uid);
      allow create: if isSignedIn() && (isAdmin() || incoming().agencyId == request.auth.uid || incoming().agencyId == 'admin');
      allow update: if isSignedIn() && (isAdmin() || (existing().agencyId == request.auth.uid && incoming().read == true));
      allow delete: if isAdmin() || (isAgency() && existing().agencyId == request.auth.uid);
    }"""

content = re.sub(old_notif_rule, new_notif_rule, content)

with open('firestore.rules', 'w') as f:
    f.write(content)
