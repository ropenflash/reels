import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VideoTabs({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="flex-wrap">
        <TabsTrigger value="video">Video</TabsTrigger>
        <TabsTrigger value="folder">Folder</TabsTrigger>
        <TabsTrigger value="shared">Shared</TabsTrigger>
        <TabsTrigger value="archive">Archive</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
