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
  const { fid, username, fc_timestamp } = body;
  const supabase = createSupabaseAppServerClient();

  const { data: findData, error: findError } = await supabase
    .from('scores')
    .select('*')
    .eq('fid', fid)
    .eq('username', username)
    .eq('fc_timestamp', fc_timestamp);

  if (findError) {
    throw new Error(`Error finding score: ${findError.message}`);
  }
  
  let newRecord = false;
  if (findData.length == 0) {
    await supabase
    .from('scores')
    .insert([
      {
        fid: fid,
        username: username,
        sn_address: '',
        score: 0,
        open: true,
        fc_timestamp: fc_timestamp,
      },
    ]);
    newRecord = true;
  }
  return new Response(JSON.stringify({ success: true, isNewRecord: newRecord }));
}

export async function PATCH(req: Request) {
  console.log("accessing api/database patch...");
  
  const body = await req.json();
  const { fid, username, sn_address, score, fc_timestamp } = body;
  console.log("received data... fid", fid);
  console.log("received data... username", username);
  console.log("received data... sn_address", sn_address);
  console.log("received data... score", score);
  console.log("received data... fc_timestamp", fc_timestamp);
  const open = false;
  const supabase = createSupabaseAppServerClient();

  // Primero, busca el registro que coincida con `fid`, `timestamp`, y `open` es true
  const { data: findData, error: findError } = await supabase
    .from('scores')
    .select('*')
    .eq('fid', fid)
    .eq('username', username)
    .eq('fc_timestamp', fc_timestamp)
    .eq('open', true);
    
    console.log("findData: ", findData);
    console.log("findError: ", findError);

  if (findError) {
    throw new Error(`Error finding score: ${findError.message}`);
  }

  // Si no encuentra un registro, o hay más de uno, no procede a actualizar
  if (findData && findData.length == 1) {
    // Si encuentra el registro y cumple con las condiciones, procede a actualizar
    const { data: udpateData, error: updateError } = await supabase
    .from('scores')
    .update({ sn_address, score, open })
    .eq('fid', fid)
    .eq('username', username)
    .eq('fc_timestamp', fc_timestamp);
    
    console.log("udpateData: ", udpateData);
    console.log("updateError: ", updateError);
    
  }
  return new Response(JSON.stringify({ success: true, message: "Record updated successfully" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}