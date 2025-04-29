import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import type { Database } from './database.types';

const supabaseUrl = environment.supabaseUrl;
const supabaseAnonKey = environment.supabaseAnonKey;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
