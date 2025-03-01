# Vereinbarungsmonitor_Webseite
Der Vereinbarungsmonitor ist eine webbasierte Anwendung, die es ermöglicht, Vereinbarungen mit Kunden zu verwalten und den Status (unterschrieben/nicht unterschrieben) zu überwachen. Die Anwendung läuft vollständig im Browser und verwendet IndexedDB als lokale Datenbank, sodass keine Server-Infrastruktur benötigt wird.

## Funktionen

### Übersicht mit Kreisdiagramm
Zeigt den aktuellen Status der Vereinbarungen an:

- Anzahl der unterschriebenen Vereinbarungen.
- Anzahl der nicht unterschriebenen Vereinbarungen.

Das Diagramm wird automatisch aktualisiert, wenn neue Daten hinzugefügt oder bestehende Daten geändert werden.

### Eingabefeld für neue Vereinbarungen
Ermöglicht das Hinzufügen neuer Vereinbarungen mit folgenden Informationen:

- Name des Kunden.
- Versanddatum der Vereinbarung.
- Name des Mitarbeiters, der die Vereinbarung verschickt hat.

### Tabelle mit allen Vereinbarungen
Zeigt alle erfassten Vereinbarungen in einer übersichtlichen Tabelle an.
Jeder Eintrag enthält:

- Name des Kunden.
- Versanddatum.
- Name des Mitarbeiters.
- Checkbox, um den Status "Unterschrieben" zu markieren.
- Button, um den Eintrag zu löschen (z. B. bei doppelten Einträgen).

### Dunkelmodus/Hellmodus
Die Anwendung unterstützt einen Dunkelmodus und einen Hellmodus.
Der ausgewählte Modus wird im localStorage gespeichert, sodass die Einstellung beim Neuladen der Seite erhalten bleibt.

### Menü mit zusätzlichen Funktionen
Ein Hamburger-Menü (☰) bietet folgende Optionen:
- Autor: Zeigt Informationen über den Autor der Anwendung an.
- Liste exportieren: Exportiert alle Vereinbarungen als JSON-Datei.
- Liste importieren: Importiert Vereinbarungen aus einer JSON-Datei.

### Lokale Datenbank (IndexedDB)
Alle Daten werden lokal im Browser gespeichert.
Es ist keine Server-Infrastruktur erforderlich.
Die Daten bleiben auch nach dem Schließen des Browsers erhalten.

## Technologien
- HTML: Struktur der Webseite.
- CSS: Styling und Design (inkl. Dunkelmodus).
- JavaScript: Interaktivität und Datenverwaltung.
- IndexedDB: Lokale Datenbank zur Speicherung der Vereinbarungen.
- Chart.js: Kreisdiagramm zur Visualisierung der Daten.
- Font Awesome: Icons für eine moderne Benutzeroberfläche.

## Lizenz
Dieses Projekt steht unter der MIT-Lizenz. Du kannst es frei verwenden, modifizieren und weiterverbreiten.
