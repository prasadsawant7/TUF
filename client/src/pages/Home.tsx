import SubmissionForm from "@/components/custom/form";

function Home() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-start gap-10 px-4 py-10">
      {/* <h1 className="text-2xl font-medium">Submit your code</h1> */}
      <SubmissionForm />
    </div>
  );
}

export default Home;
