export default function CreateEventPage() {
    return (
        <div className="container mx-auto max-w-7xl w-full min-h-[calc(100vh-112px)] flex flex-col space-y-6 pb-24">
            <div className="flex-1 min-h-0">
                <EventWizard />
            </div>
        </div>
    );
}