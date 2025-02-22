import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Politico {
  uuid: number;
  idCidade: number | null;
  nomeUrna: string | null;
  nomeCompleto: string;
  EstadoCivil: string | null;
  grauInstrucao: string | null;
  ocupacao: string | null;
  UfNascimento: string | null;
  MunicipioNascimento: string | null;
  localCandidatura: string | null;
  fotoUrl: string | null;
  cargo: string | null;
  siglaPartido: string | null;
  dataDeNascimento: Date | null;
  apoiaMara: boolean | null;
  eleito: boolean | null;
}

export function usePrefeitos() {
  const [prefeitos, setPrefeitos] = useState<Politico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPrefeitos = async (page = 1, perPage = 5, searchTerm = '', filtroEleito?: boolean) => {
    try {
      console.log('Iniciando busca de prefeitos com parâmetros:', {
        page,
        perPage,
        searchTerm,
        filtroEleito,
        tipo: typeof filtroEleito
      });
      
      setLoading(true);
      setError(null);

      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      let query = supabase
        .from('politicos')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(
          `nomeUrna.ilike.%${searchTerm}%,` +
          `nomeCompleto.ilike.%${searchTerm}%,` +
          `siglaPartido.ilike.%${searchTerm}%,` +
          `cargo.ilike.%${searchTerm}%,` +
          `localCandidatura.ilike.%${searchTerm}%,` +
          `ocupacao.ilike.%${searchTerm}%,` +
          `grauInstrucao.ilike.%${searchTerm}%`
        );
      }

      query = query
        .range(from, to)
        .order('nomeCompleto', { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }

      console.log('Resultados da busca:', {
        total: count,
        encontrados: data?.length || 0,
        primeiroRegistro: data?.[0]
      });

      setPrefeitos(data || []);
      if (count !== null) setTotalCount(count);

    } catch (err) {
      console.error('Erro ao buscar políticos:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updatePrefeito = async (uuid: number, dadosAtualizados: Partial<Politico>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('politicos')
        .update(dadosAtualizados)
        .eq('uuid', uuid)
        .select()
        .single();

      if (error) throw error;

      setPrefeitos(prev => prev.map(p => p.uuid === uuid ? { ...p, ...data } : p));
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao atualizar político:', err);
      return { success: false, error: 'Erro ao atualizar dados. Por favor, tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const deletePrefeito = async (uuid: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('politicos')
        .delete()
        .eq('uuid', uuid);

      if (error) throw error;

      setPrefeitos(prev => prev.filter(p => p.uuid !== uuid));
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar político:', err);
      return { success: false, error: 'Erro ao deletar registro. Por favor, tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    prefeitos,
    loading,
    error,
    totalCount,
    fetchPrefeitos,
    updatePrefeito,
    deletePrefeito
  };
} 