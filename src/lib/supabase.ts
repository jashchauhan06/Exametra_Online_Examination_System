// Compatibility shim re-exporting InsForge client
import { insforge, insforgeAdmin } from './insforge';

export { insforge, insforgeAdmin };
export const supabase = insforge;
export const supabaseAdmin = insforgeAdmin;
export default insforge;
