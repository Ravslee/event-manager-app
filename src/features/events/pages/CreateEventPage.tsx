export default function CreateEventPage() {
    return (
        <div className="container mx-auto max-w-4xl min-h-[calc(100vh-112px)] flex flex-col py-3 sm:py-6">
            <div className="flex-1 min-h-0">
                <EventWizard />
            </div>
        </div>
    );
}