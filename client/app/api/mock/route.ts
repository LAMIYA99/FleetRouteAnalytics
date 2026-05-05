import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const driverQuery = searchParams.get('driver');

  let mockTrips = [
    {
      id: "trip_1",
      driver: "Əli Məmmədov",
      plate: "99-AB-123",
      date: "2026-05-20",
      startTime: "08:30",
      endTime: "10:15",
      waitDuration: "10 min",
      from: "Bakı, Gənclik",
      to: "Sumqayıt",
      score: 85,
      distanceKm: 45.2,
      durationMin: 105,
      idlingSec: 120,
      result: "Completed",
      maxSpeedKmh: 110,
      avgSpeedKmh: 65,
      fuelLiters: 4.5,
      violations: [
        { type: "Speeding", severity: "Medium", time: "09:15", location: "Xırdalan dairəsi" }
      ]
    },
    {
      id: "trip_2",
      driver: "Ramin Əliyev",
      plate: "10-BC-456",
      date: "2026-05-20",
      startTime: "11:00",
      endTime: "11:45",
      waitDuration: "5 min",
      from: "Sumqayıt",
      to: "Bakı, 20 Yanvar",
      score: 55,
      distanceKm: 35.8,
      durationMin: 45,
      idlingSec: 300,
      result: "Completed",
      maxSpeedKmh: 135,
      avgSpeedKmh: 85,
      fuelLiters: 5.2,
      violations: [
        { type: "Harsh Braking", severity: "High", time: "11:20", location: "Binəqədi şosesi" },
        { type: "Speeding", severity: "High", time: "11:35", location: "Bakı-Quba yolu" }
      ]
    },
    {
      id: "trip_3",
      driver: "Vüqar Həsənov",
      plate: "77-CD-789",
      date: "2026-05-21",
      startTime: "14:20",
      endTime: "15:10",
      waitDuration: "0 min",
      from: "Bakı, Nizami",
      to: "Bakı, Əhmədli",
      score: 95,
      distanceKm: 12.5,
      durationMin: 50,
      idlingSec: 45,
      result: "Completed",
      maxSpeedKmh: 75,
      avgSpeedKmh: 40,
      fuelLiters: 1.8,
      violations: []
    }
  ];

  if (startDate) {
    mockTrips = mockTrips.filter(t => t.date >= startDate);
  }
  if (endDate) {
    mockTrips = mockTrips.filter(t => t.date <= endDate);
  }
  if (driverQuery) {
    mockTrips = mockTrips.filter(t => t.driver.toLowerCase().includes(driverQuery.toLowerCase()));
  }

  return NextResponse.json({ data: mockTrips });
}
