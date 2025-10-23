import { httpClient } from './http';
import type { DictItem } from '@/store';

export async function fetchDictionaries(codes: string[]): Promise<Record<string, DictItem[]>> {
  const { data } = await httpClient.post<Record<string, DictItem[]>>(
    '/sys/sys-dictionaries/getDictionariesApply',
    codes
  );
  return data ?? {};
}
