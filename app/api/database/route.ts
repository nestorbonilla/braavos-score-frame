import { createSupabaseAppServerClient } from '@/lib/supabaseAppRouterClient';

interface ScoreRecord {
  id: number;
  sn_address: string;
  score: number;
  fc_timestamp: Date; // Asumiendo que es una cadena; ajusta según sea necesario
  open: boolean;
}

export async function GET(req: Request) {
  console.log("accessing api/database get...");
  const supabase = createSupabaseAppServerClient();

  // Obtén registros filtrados y ordenados.
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('open', false)
    .order('score', { ascending: false }) // Primero por score descendente
    .order('fc_timestamp', { ascending: false }) // Luego por fc_timestamp descendente
    .limit(100); // Obtén una cantidad suficiente de registros para procesar después

  if (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Filtra para obtener sn_address únicos y limita a los top 10.
  const filteredData = data.reduce((acc: ScoreRecord[], item: ScoreRecord) => {
    const exists = acc.find(accItem => accItem.sn_address === item.sn_address);
    if (!exists) {
      acc.push(item);
    }
    return acc;
  }, [] as ScoreRecord[]).slice(0, 10); // Asegúrate de que el acumulador inicial esté tipado correctamente

  return new Response(JSON.stringify({ success: true, data: filteredData }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  console.log("accessing api/database post...");
  const body = await req.json();
  const { fid, timestamp } = body;
  const supabase = createSupabaseAppServerClient();

  const { data: findData, error: findError } = await supabase
    .from('scores')
    .select('*')
    .eq('fid', fid);

  if (findError) {
    throw new Error(`Error finding score: ${findError.message}`);
  }
  console.log("during select in api/database post...");
  console.log(findData.length);

  if (findData.length > 0) {
    // Registro ya existe, no insertar
    return new Response(JSON.stringify({ success: false, message: "Record already exists" }), {
      status: 409, // Conflicto
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Si no encuentra un registro, o hay más de uno, no procede a actualizar
  
    const { data: insertData, error: insertError } = await supabase
    .from('scores')
    .insert([
      {
        fid: fid,
        sn_address: '',
        score: 0,
        open: true,
        fc_timestamp: timestamp,
      },
    ]);
    return new Response(JSON.stringify({ success: true, fid, timestamp }));
  
}

export async function PATCH(req: Request) {
  console.log("accessing api/database patch...");
  const body = await req.json();
  const { fid, sn_address, score, timestamp } = body;
  const open = false;
  const supabase = createSupabaseAppServerClient();

  // Primero, busca el registro que coincida con `fid`, `timestamp`, y `open` es true
  const { data: findData, error: findError } = await supabase
    .from('scores')
    .select('*')
    .eq('fid', fid)
    .eq('timestamp', timestamp)
    .eq('open', true);

  if (findError) {
    throw new Error(`Error finding score: ${findError.message}`);
  }

  // Si no encuentra un registro, o hay más de uno, no procede a actualizar
  if (!findData || findData.length !== 1) {
    return new Response(JSON.stringify({ success: false, message: "No matching record found or multiple records found." }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Si encuentra el registro y cumple con las condiciones, procede a actualizar
  const { data, error } = await supabase
    .from('scores')
    .update({ sn_address, score, open })
    .eq('fid', fid)
    .eq('fc_timestamp', timestamp);

  if (error) {
    throw new Error(`Error updating score: ${error.message}`);
  }

  return new Response(JSON.stringify({ success: true, message: "Record updated successfully", data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}