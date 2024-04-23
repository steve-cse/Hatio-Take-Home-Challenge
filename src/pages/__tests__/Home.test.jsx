import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './../Home';
import { BrowserRouter } from 'react-router-dom';
import { supabaseClient } from './../../config/supabase';
import { waitFor } from '@testing-library/react';


// Partially Mock the Supabase client
vi.mock('../config/supabase', () => ({
    supabaseClient: {
        from: vi.fn(() => supabaseClient),
        select: vi.fn(() => Promise.resolve({ data: [{ id: 1, title: "Test Project", description: 'Test Todo',status:"Pending"}], error: null })),
        eq: vi.fn(() => Promise.resolve({ data: [{ id: 1, title: "Project Title", description: 'Test Todo' }], error: null })),
        order: vi.fn(() => Promise.resolve({ data: [{ id: 1, title: "Project Title", description: 'Test Todo',status:"Pending"}], error: null })),
        insert:vi.fn(() => supabaseClient),
        update: vi.fn(() => Promise.resolve({ data: [{ description: 'Updated Todo' }], error: null })),
        delete: vi.fn(() => Promise.resolve({ data: [], error: null }))
    }
}));


vi.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        user: { email: 'test@example.com', name: 'John Doe', isAuthenticated: true }
    })
}));


describe('TodoList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    
    it('allows the user to add a new project', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        const input = screen.getByPlaceholderText('Enter project title');
        const addButton = screen.getByRole('button', { name: 'Add Project' });
        fireEvent.change(input, { target: { value: 'Test Project' } });
        fireEvent.click(addButton);
        await waitFor(() => expect(screen.getByText('Test Project')).toBeInTheDocument());
       
    });


});

