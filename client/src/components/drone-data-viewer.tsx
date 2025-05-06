import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  MapPin, 
  Download, 
  Info, 
  Image as ImageIcon, 
  FileDigit, 
  AlertCircle,
  Upload,
  CheckCircle2,
  Layers
} from "lucide-react";

interface DroneDataProps {
  villageId: number;
  dayMode: boolean;
}

// Data from the provided PDF
const DRONE_DATA = [
  { 
    id: 1,
    name: "Gautam budh Nagar",
    count: 2,
    hasTif: true,
    hasShp: true,
    downloadUrl: "https://svamitva.nic.in/DownloadPDF/TifFile/Gautam_budh_Nagar_2.zip",
    color: "#3949AB" // Indigo
  },
  { 
    id: 2,
    name: "Gujarat",
    count: 5,
    hasTif: true,
    hasShp: true,
    downloadUrl: "https://svamitva.nic.in/DownloadPDF/TifFile/Gujarat_5.zip",
    color: "#F57C00" // Orange
  },
  { 
    id: 3,
    name: "Maharashtra",
    count: 1,
    hasTif: true,
    hasShp: true,
    downloadUrl: "https://svamitva.nic.in/DownloadPDF/TifFile/Maharashtra_1.zip",
    color: "#D32F2F" // Red
  },
  { 
    id: 4,
    name: "Madhya Pradesh",
    count: 1,
    hasTif: true,
    hasShp: true,
    downloadUrl: "https://svamitva.nic.in/DownloadPDF/TifFile/MP_shape.zip",
    color: "#388E3C" // Green
  },
  { 
    id: 5,
    name: "Chhattisgarh",
    count: 1,
    hasTif: true,
    hasShp: true,
    downloadUrl: "https://svamitva.nic.in/DownloadPDF/TifFile/Chhattisgarh_2.zip",
    color: "#7B1FA2" // Purple
  }
];

// Map our existing state IDs to the drone data IDs
const STATE_TO_DRONE_MAP: Record<number, number> = {
  26: 1, // Tamil Nadu -> Gautam budh Nagar (for demo only)
  27: 3, // Andhra Pradesh -> Maharashtra (for demo only)
  28: 2, // Rajasthan -> Gujarat (for demo only)
  29: 4, // Kerala -> Madhya Pradesh (for demo only)
  30: 5  // Telangana -> Chhattisgarh (for demo only)
};

export default function DroneDataViewer({ villageId, dayMode }: DroneDataProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);

  // Fetch village data
  const { data: village, isLoading, error } = useQuery<any>({
    queryKey: ["/api/villages", villageId],
  });
  
  // Simulate processing steps when the user wants to process data
  useEffect(() => {
    if (isProcessing && processingStep < 4) {
      const timer = setTimeout(() => {
        setProcessingStep(prev => prev + 1);
        if (processingStep === 3) {
          setProcessingComplete(true);
          setIsProcessing(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, processingStep]);
  
  // Function to start processing
  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingStep(0);
    setProcessingComplete(false);
  };

  if (isLoading) {
    return (
      <div className="relative h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !village) {
    return (
      <div className="relative h-[500px] bg-red-50 rounded-lg flex items-center justify-center">
        <div className="bg-white p-4 rounded shadow text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Error loading village data</p>
          <p className="text-sm text-gray-500 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Find the drone data corresponding to this village's state
  const droneDataId = STATE_TO_DRONE_MAP[village.stateId] || 1; // Default to the first one
  const droneData = DRONE_DATA.find(d => d.id === droneDataId) || DRONE_DATA[0];

  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg bg-white">
      {/* SVG-based Drone Data Representation */}
      <div 
        className="w-full h-full relative"
        style={{ 
          backgroundColor: dayMode ? '#87CEEB' : '#071831',
          filter: dayMode ? 'brightness(110%)' : 'brightness(70%) contrast(120%)',
        }}
      >
        {/* Drone data visualization using SVG */}
        <svg 
          viewBox="0 0 1000 500" 
          className="w-full h-full"
          style={{ filter: dayMode ? 'none' : 'grayscale(30%)' }}
        >
          {/* Background */}
          <rect x="0" y="0" width="1000" height="500" fill={dayMode ? "#87CEEB" : "#071831"} />

          {/* State-colored satellite imagery areas */}
          <rect x="50" y="50" width="900" height="400" fill={droneData.color} opacity="0.2" />
          
          {/* Grid overlay pattern */}
          <g opacity="0.8">
            {Array(40).fill(0).map((_, i) => (
              <line 
                key={`vline-${i}`} 
                x1={50 + i * 22.5} 
                y1="50" 
                x2={50 + i * 22.5} 
                y2="450" 
                stroke="#d1d5db" 
                strokeWidth="0.3" 
              />
            ))}
            {Array(20).fill(0).map((_, i) => (
              <line 
                key={`hline-${i}`} 
                x1="50" 
                y1={50 + i * 20} 
                x2="950" 
                y2={50 + i * 20} 
                stroke="#d1d5db" 
                strokeWidth="0.3" 
              />
            ))}
          </g>
          
          {/* Satellite view representation */}
          <g>
            {/* Roads */}
            <path 
              d="M 50 250 L 950 250" 
              stroke="#FFF" 
              strokeWidth="8" 
              strokeLinecap="round" 
            />
            <path 
              d="M 500 50 L 500 450" 
              stroke="#FFF" 
              strokeWidth="6" 
              strokeLinecap="round" 
            />
            
            {/* Plot boundaries - based on the state */}
            <g>
              {Array(30).fill(0).map((_, i) => {
                const x = 100 + (Math.random() * 800);
                const y = 100 + (Math.random() * 300);
                const width = 30 + (Math.random() * 70);
                const height = 30 + (Math.random() * 70);
                return (
                  <rect 
                    key={`plot-${i}`}
                    x={x} 
                    y={y} 
                    width={width} 
                    height={height}
                    stroke={droneData.color}
                    strokeWidth="2"
                    fill="none"
                  />
                );
              })}
            </g>
            
            {/* Agricultural plots with striped patterns */}
            <defs>
              <pattern 
                id="farm-pattern" 
                patternUnits="userSpaceOnUse" 
                width="10" 
                height="10"
                patternTransform="rotate(45)"
              >
                <line 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="10" 
                  stroke={droneData.color} 
                  strokeWidth="2" 
                />
              </pattern>
            </defs>
            
            <g opacity="0.6">
              <rect x="70" y="70" width="200" height="150" fill="url(#farm-pattern)" />
              <rect x="700" y="300" width="200" height="120" fill="url(#farm-pattern)" />
              <rect x="300" y="300" width="150" height="120" fill="url(#farm-pattern)" />
            </g>
            
            {/* Coordinates at the corners */}
            <text x="60" y="30" fill="white" fontSize="12" fontWeight="bold">N 28°32'14.5"</text>
            <text x="880" y="30" fill="white" fontSize="12" fontWeight="bold">N 28°32'18.9"</text>
            <text x="60" y="480" fill="white" fontSize="12" fontWeight="bold">E 77°14'42.6"</text>
            <text x="880" y="480" fill="white" fontSize="12" fontWeight="bold">E 77°14'49.3"</text>
          </g>
          
          {/* Scale and metadata */}
          <g transform="translate(450, 450)">
            <rect width="100" height="10" fill="white" />
            <text x="50" y="30" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">50m</text>
          </g>
          
          {/* Drone survey label */}
          <text x="500" y="30" fill="white" fontSize="16" textAnchor="middle" fontWeight="bold">
            SVAMITVA Drone Survey: {droneData.name}
          </text>
        </svg>
        
        {/* Instructions overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-black bg-opacity-50 p-4 rounded-lg pointer-events-none">
          <p className="text-white text-lg">Click to view drone data details</p>
        </div>

        {/* Interaction overlay - transparent button that covers the whole area */}
        <button 
          className="absolute inset-0 bg-transparent w-full h-full cursor-pointer"
          onClick={() => setIsOverlayOpen(true)}
          aria-label="View drone data details"
        />
      </div>

      {/* Informational footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 px-3 py-2 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {droneData.name} Drone Data
          </h3>
          <div className="flex space-x-2">
            {droneData.hasTif && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                <ImageIcon className="w-3 h-3 mr-1" /> TIF
              </span>
            )}
            {droneData.hasShp && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                <FileDigit className="w-3 h-3 mr-1" /> SHP
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            {droneData.count} files available from SVAMITVA
          </p>
          {isProcessing ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              disabled
            >
              <div className="animate-spin h-3 w-3 mr-1 border-2 border-primary border-t-transparent rounded-full"></div>
              Processing...
            </Button>
          ) : processingComplete ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-green-50"
              onClick={() => setIsOverlayOpen(true)}
            >
              <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" /> View Results
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={startProcessing}
            >
              <Layers className="w-3 h-3 mr-1" /> Process Data
            </Button>
          )}
        </div>
      </div>

      {/* Detailed overlay when clicked */}
      {isOverlayOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-80 z-20 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg max-w-xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {droneData.name} Drone Data
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsOverlayOpen(false)}
              >
                ×
              </button>
            </div>
            
            {isProcessing ? (
              <div className="py-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                  
                  <div className="w-full max-w-md">
                    <h4 className="text-center font-medium mb-4">Processing Drone Data...</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${processingStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                          {processingStep >= 1 ? '✓' : '1'}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Downloading GeoTIFF files</p>
                          {processingStep >= 1 && <p className="text-sm text-gray-500">Downloaded {droneData.count} files</p>}
                        </div>
                      </div>
                      
                      <div className="w-px h-6 bg-gray-300 ml-4"></div>
                      
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${processingStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                          {processingStep >= 2 ? '✓' : '2'}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Processing SHP vectors</p>
                          {processingStep >= 2 && <p className="text-sm text-gray-500">Extracted {Math.floor(Math.random() * 100) + 150} property boundaries</p>}
                        </div>
                      </div>
                      
                      <div className="w-px h-6 bg-gray-300 ml-4"></div>
                      
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${processingStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                          {processingStep >= 3 ? '✓' : '3'}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Rendering visualization</p>
                          {processingStep >= 3 && <p className="text-sm text-gray-500">Analysis complete</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : processingComplete ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="font-medium text-green-800">Processing Complete</h4>
                    <p className="text-sm text-green-700 mt-1">
                      The drone data for {droneData.name} has been successfully processed 
                      and analyzed for development planning.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Land Use Analysis</h5>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Agricultural Land</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-right mt-1">65%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Residential</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <p className="text-xs text-right mt-1">25%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Other</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <p className="text-xs text-right mt-1">10%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Property Statistics</h5>
                    <ul className="text-sm space-y-2">
                      <li className="flex justify-between">
                        <span>Total Properties:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 100) + 150}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Average Size:</span>
                        <span className="font-medium">0.5 hectares</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Water Bodies:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 5) + 2}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Road Length:</span>
                        <span className="font-medium">12.3 km</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setProcessingComplete(false);
                      setIsOverlayOpen(false);
                    }}
                  >
                    Close
                  </Button>
                  
                  <Link href="/sectors">
                    <Button>
                      <Layers className="w-4 h-4 mr-2" /> Plan Development
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">About This Data</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      This dataset contains high-resolution drone imagery and vector data for {droneData.name}, 
                      collected as part of the SVAMITVA scheme to provide 'record of rights' to village 
                      household owners.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ImageIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">File Contents</h4>
                    <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                      {droneData.hasTif && (
                        <li>GeoTIFF files - Georeferenced drone imagery</li>
                      )}
                      {droneData.hasShp && (
                        <li>Shapefile (SHP) - Vector data of property boundaries</li>
                      )}
                      <li>{droneData.count} total files included in the download</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Usage Restrictions</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      This data is provided for educational and research purposes. Please refer to the 
                      SVAMITVA scheme guidelines for complete usage terms and restrictions.
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setIsOverlayOpen(false)}
                  >
                    Close
                  </Button>
                  
                  <Button
                    onClick={startProcessing}
                  >
                    <Upload className="w-4 h-4 mr-2" /> Process Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}