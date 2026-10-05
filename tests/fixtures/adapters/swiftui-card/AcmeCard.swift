import SwiftUI

// Reusable design-system view. Theme tokens live in AcmeTheme.swift (AcmeTheme.surface, AcmeTheme.text, AcmeSpacing.m).
struct AcmeCard: View {
    let title: String
    var onDismiss: () -> Void

    var body: some View {
        HStack {
            Text(title)
                .font(.system(size: 14))                       // fixed size
                .foregroundColor(Color(red: 0.1, green: 0.1, blue: 0.1))
            Spacer()
            Button(action: onDismiss) { Text("✕") }             // glyph as the only content
        }
        .padding(12)
        .background(Color(red: 0.96, green: 0.96, blue: 0.96))
    }
}
