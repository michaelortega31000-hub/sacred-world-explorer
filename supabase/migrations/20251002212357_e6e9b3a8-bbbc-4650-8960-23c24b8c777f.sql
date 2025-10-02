-- Drop existing policies on messages table
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete their sent messages" ON public.messages;

-- Create new policies with explicit authentication requirement
CREATE POLICY "Authenticated users can view their own messages"
ON public.messages
FOR SELECT
TO authenticated
USING ((auth.uid() = sender_id) OR (auth.uid() = receiver_id));

CREATE POLICY "Authenticated users can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Authenticated users can delete their sent messages"
ON public.messages
FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

-- Explicitly deny UPDATE operations - messages should not be editable after sending
CREATE POLICY "Messages cannot be updated"
ON public.messages
FOR UPDATE
TO authenticated
USING (false);