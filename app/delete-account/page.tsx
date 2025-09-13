export const metadata = {
  title: "DeHub — Account & Data Deletion",
  description:
    "How to request account deletion or data deletion on DeHub, what is removed or retained, verification steps, and processing timelines.",
};

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 text-sm leading-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Account and Data Deletion</h1>

      <p className="mb-8 text-theme-neutrals-200">
        This page explains how you can request deletion of your DeHub account and associated data, or
        request deletion of specific data without deleting your account. You can use this URL in app
        stores where a "Delete account URL" is required.
      </p>

      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">How to submit a deletion request</h2>
        <ol className="list-decimal space-y-2 pl-6 text-theme-neutrals-200">
          <li>
            Send an email to <a className="text-theme-orange-400 underline" href="mailto:tech@dehub.net">tech@dehub.net</a> from the email address linked to your DeHub account. If your
            account is wallet-based, include your wallet address as shown in the app.
          </li>
          <li>
            Use one of the following subject lines so we can route your request quickly:
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Subject:</strong> Account deletion</li>
              <li><strong>Subject:</strong> Data deletion</li>
            </ul>
          </li>
          <li>
            Include the following details in the email body:
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Your DeHub username (if set)</li>
              <li>The email address linked to your account</li>
              <li>Your primary wallet address used on DeHub</li>
              <li>The type of request: account deletion or data deletion</li>
              <li>Optional: brief reason for the request</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">What is deleted vs. retained</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium">Deleted</h3>
            <ul className="list-disc space-y-1 pl-6 text-theme-neutrals-200">
              <li>Account profile (username, display name, bio, avatar, cover)</li>
              <li>Social links (e.g., X/Twitter, Discord, Instagram, etc.)</li>
              <li>Off‑chain app activity (comments, likes, follows, notifications)</li>
              <li>Uploaded content stored by DeHub (subject to takedown propagation)</li>
              <li>App-side associations to your wallet address</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Retained (not deletable)</h3>
            <ul className="list-disc space-y-1 pl-6 text-theme-neutrals-200">
              <li>
                On‑chain records (transactions, mints, transfers) recorded on public blockchains.
                These are immutable and cannot be altered or deleted by DeHub.
              </li>
              <li>
                Security, fraud-prevention, and audit logs retained for up to 90 days, or longer if
                legally required.
              </li>
              <li>
                Minimal records necessary to comply with law, resolve disputes, or enforce our
                terms.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">Data deletion without deleting your account</h2>
        <p className="text-theme-neutrals-200">
          Yes. You may request that certain data (for example, your profile information or
          off‑chain activity) be deleted while keeping your account active. Use the subject line
          <strong> Data deletion</strong> and specify the categories of data you want removed.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">Verification</h2>
        <p className="text-theme-neutrals-200">
          We will verify that the request is coming from the email linked to the account. If your
          email cannot be verified, we may ask you to sign a verification message with the wallet
          address associated with your DeHub account.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">Processing time and retention</h2>
        <ul className="list-disc space-y-1 pl-6 text-theme-neutrals-200">
          <li>We aim to acknowledge requests within 7 days and complete processing within 30 days.</li>
          <li>
            Backups and security logs may persist for up to 90 days before being automatically
            purged, unless a longer period is required by law.
          </li>
          <li>Once processed, deletion is irreversible.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">Sample email templates</h2>
        <div className="space-y-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <div>
            <h3 className="mb-2 font-medium">Account deletion</h3>
            <pre className="whitespace-pre-wrap rounded bg-black/30 p-3 text-[13px] text-theme-neutrals-200">{`To: tech@dehub.net
Subject: Account deletion

Hello DeHub team,

Please delete my DeHub account and associated data.

Username: <your-username>
Email: <email-linked-to-account>
Wallet address: <0x...>
Reason (optional): <reason>

I understand this is irreversible.

Thank you,`}</pre>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Data deletion (keep account)</h3>
            <pre className="whitespace-pre-wrap rounded bg-black/30 p-3 text-[13px] text-theme-neutrals-200">{`To: tech@dehub.net
Subject: Data deletion

Hello DeHub team,

Please delete the following data from my account while keeping my account active:
- <e.g., profile info>
- <e.g., off-chain activity such as likes/comments>

Username: <your-username>
Email: <email-linked-to-account>
Wallet address: <0x...>

Thank you,`}</pre>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Contact</h2>
        <p className="text-theme-neutrals-200">
          Email: <a className="text-theme-orange-400 underline" href="mailto:tech@dehub.net">tech@dehub.net</a>
        </p>
      </section>

      <p className="text-xs text-theme-neutrals-300">
        Note: DeHub operates with blockchain technology. On‑chain records are public and immutable.
        While we can remove app-side references, we cannot alter or delete blockchain data.
      </p>
    </main>
  );
}
