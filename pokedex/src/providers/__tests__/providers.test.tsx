import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Providers } from '../providers';

jest.mock('@/components/ui', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
}));
jest.mock('../pokedex.provider', () => ({
  PokedexProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pokedex-provider">{children}</div>
  ),
}));
jest.mock('../pokemon.provider', () => ({
  PokemonProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pokemon-provider">{children}</div>
  ),
}));
jest.mock('../query.provider', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}));

describe('Providers', () => {
  it('renders children and composes all providers', () => {
    // Arrange
    const TestChild = () => <div data-testid="test-child">Hello</div>;

    // Act
    const { getByTestId } = render(
      <Providers>
        <TestChild />
      </Providers>
    );

    // Assert
    expect(getByTestId('query-provider')).toBeInTheDocument();
    expect(getByTestId('pokedex-provider')).toBeInTheDocument();
    expect(getByTestId('pokemon-provider')).toBeInTheDocument();
    expect(getByTestId('tooltip-provider')).toBeInTheDocument();
    expect(getByTestId('test-child')).toBeInTheDocument();
  });
});
