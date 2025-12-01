import FlashCardDeck from './FlashCardDeck';

export default function Section2() {
  return (
    <section id="section2" className="section-two relative z-0 pt-32 pb-48">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="flex flex-col gap-4 text-center text-white">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Campaign Management, Reimagined.</h2>
          <p className="text-base leading-relaxed text-sky-100/90 sm:text-lg">
            A simple scroll shows how Sire Media organizes every deliverable, approval, timeline, and report.
          </p>
        </div>
        <FlashCardDeck />
      </div>
    </section>
  );
}
