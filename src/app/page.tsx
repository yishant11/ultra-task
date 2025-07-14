import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationDisplay } from "@/components/location-display";
import { NetworkInfo } from "@/components/network-info";
import { DrawingPad } from "@/components/drawing-pad";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-10 underline text-[#d1495b]">
        Local Utilities Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-[#00798c]">Your Location</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Get your current geographical coordinates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationDisplay />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#00798c]">Network Status</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Monitor your internet connection details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetworkInfo />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-[#00798c]">Drawing Pad</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              A simple canvas for quick sketches or notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DrawingPad />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
