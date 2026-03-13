
-- Fix journal_entries: change policies from public to authenticated
DROP POLICY "Users can view own journal" ON public.journal_entries;
CREATE POLICY "Users can view own journal" ON public.journal_entries AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY "Users can insert own journal" ON public.journal_entries;
CREATE POLICY "Users can insert own journal" ON public.journal_entries AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Users can delete own journal" ON public.journal_entries;
CREATE POLICY "Users can delete own journal" ON public.journal_entries AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix mood_entries: change policies from public to authenticated
DROP POLICY "Users can view own moods" ON public.mood_entries;
CREATE POLICY "Users can view own moods" ON public.mood_entries AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY "Users can insert own moods" ON public.mood_entries;
CREATE POLICY "Users can insert own moods" ON public.mood_entries AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix profiles: change INSERT/UPDATE from public to authenticated
DROP POLICY "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix projects: change policies from public to authenticated
DROP POLICY "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" ON public.projects AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" ON public.projects AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix user_progress: change policies from public to authenticated
DROP POLICY "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress" ON public.user_progress AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress" ON public.user_progress AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress" ON public.user_progress AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);
