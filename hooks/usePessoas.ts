import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Pessoa {
  id: number;
  created_at: string;
  nome: string | null;
  telefone: string | null;
  Adress: string | null;
  lideranca: boolean | null;
  organizacao: number | null;
  numeroImovel: number | null;
  fotoURL: string | null;
  localTrabalho: number | null;
  cadastradoPor: string | null;
  dataCadastro: string | null;
  estadoCivil: string | null;
  profissao: string | null;
  grauInstrucao: number | null;
  apelido: string | null;
  tipoPessoa: string | null;
  colaborador: boolean | null;
  cargo: string | null;
  Ativo: boolean | null;
  email: string | null;
  dataNascimento: string | null;
  genero: string | null;
  vinculo_Lideranca: string | null;
  nomeRua: string | null;
  bairro: string | null;
  cidade: string | null;
  latitude: string | null;
  longitude: string | null;
}

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPessoas = async (page = 1, perPage = 5, searchTerm = '') => {
    try {
      setLoading(true);
      setError(null);

      // Calcula o offset baseado na página
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      // Consulta base
      let query = supabase
        .from('dPessoas')
        .select('*', { count: 'exact' });

      // Adiciona filtro de busca se houver termo
      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`);
      }

      // Adiciona paginação
      query = query
        .range(from, to)
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      setPessoas(data || []);
      if (count !== null) setTotalCount(count);

    } catch (err) {
      console.error('Erro ao buscar pessoas:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addPessoa = async (novaPessoa: Omit<Pessoa, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dPessoas')
        .insert([novaPessoa])
        .select()
        .single();

      if (error) throw error;

      setPessoas(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao adicionar pessoa:', err);
      return { success: false, error: 'Erro ao adicionar pessoa. Por favor, tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const updatePessoa = async (id: number, dadosAtualizados: Partial<Pessoa>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dPessoas')
        .update(dadosAtualizados)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPessoas(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao atualizar pessoa:', err);
      return { success: false, error: 'Erro ao atualizar pessoa. Por favor, tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const deletePessoa = async (id: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('dPessoas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPessoas(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar pessoa:', err);
      return { success: false, error: 'Erro ao deletar pessoa. Por favor, tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    pessoas,
    loading,
    error,
    totalCount,
    fetchPessoas,
    addPessoa,
    updatePessoa,
    deletePessoa
  };
} 