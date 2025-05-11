import { Button } from "@/components/ui/button";


function HomePage() {
  return (
    <>
  <h1 className="text-3xl text-muted-foreground">Home page</h1>
      <Button variant='outline' size='lg' className="capitalize m-8 text-red-500">Add</Button>
    </>
  );
}
export default HomePage;