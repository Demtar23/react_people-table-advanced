import { PeopleTable } from './PeopleTable';
import { useEffect, useState } from 'react';
import { Person } from '../types';
import { useSearchParams } from 'react-router-dom';
import { getPeople } from '../api';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const sex = searchParams.get('sex');
  const centuries = searchParams.getAll('centuries');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  function getFilteredPeoples() {
    let result = [...people];

    if (query) {
      const normalizeQuery = query.toLowerCase();

      result = result.filter(
        person =>
          person.name.toLowerCase().includes(normalizeQuery) ||
          person.motherName?.toLowerCase().includes(normalizeQuery) ||
          person.fatherName?.toLowerCase().includes(normalizeQuery),
      );
    }

    if (sex) {
      result = result.filter(person => person.sex === sex);
    }

    if (centuries.length > 0) {
      result = result.filter(person => {
        const century = Math.ceil(person.born / 100);

        return centuries.includes(String(century));
      });
    }

    if (sort) {
      result.sort((a, b) => {
        let aValue = a[sort as keyof Person];
        let bValue = b[sort as keyof Person];

        if (aValue === null || aValue === undefined) {
          aValue = '';
        }

        if (bValue === null || bValue === undefined) {
          bValue = '';
        }

        if (aValue < bValue) {
          return order === 'desc' ? 1 : -1;
        }

        if (aValue > bValue) {
          return order === 'desc' ? -1 : 1;
        }

        return 0;
      });
    }

    return result;
  }

  const filteredPeople = getFilteredPeoples();

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    getPeople()
      .then(setPeople)
      .catch(() => {
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <PeopleTable
        people={filteredPeople}
        loading={isLoading}
        error={error}
        totalPeople={people.length}
      />
    </>
  );
};
