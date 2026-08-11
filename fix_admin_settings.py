import re

content = open('components/admin/AdminSettings.tsx').read()
if 'import { useAppStore }' not in content:
    content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAppStore } from "../../src/store/useAppStore";')
    content = content.replace('export function AdminSettings() {', 'export function AdminSettings() {\n  const clearData = useAppStore(state => state.clearData);')
    
    clear_btn = '''<div className="pt-4 border-t border-red-200">
                  <Button variant="destructive" onClick={() => {
                    if (window.confirm("Êtes-vous sûr de vouloir supprimer TOUTES les données (agences, requêtes, pays, etc) ? Cette action est irréversible.")) {
                      // Call a function that wipes the database, but for now we clear the store.
                      // Note: wiping firestore collections from client is complex, typically requires deleting each doc.
                      // We will just clear the local store for this demo.
                      clearData();
                      alert("Données effacées de l'affichage actuel.");
                    }
                  }}>
                    Tout Réinitialiser / Effacer les données
                  </Button>
                </div>'''
    
    content = content.replace('</CardContent>\n          </Card>\n        </div>\n      </div>', '</CardContent>\n          </Card>\n' + clear_btn + '\n        </div>\n      </div>')
    
    open('components/admin/AdminSettings.tsx', 'w').write(content)
