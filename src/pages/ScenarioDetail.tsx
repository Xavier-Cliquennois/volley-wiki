import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Backward-compatibility shim — the canonical scenario URL is now
 * `/scenarios?id=...` so the wizard + player live on the same page and
 * stay sticky when the user swaps scenarios. Redirect old links of the
 * form `/scenarios/:id` to the new query-param form on mount.
 */
export default function ScenarioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(id ? `/scenarios?id=${id}` : '/scenarios', { replace: true });
  }, [id, navigate]);

  return null;
}
