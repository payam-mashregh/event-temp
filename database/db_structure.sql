--
-- PostgreSQL database dump
--

\restrict MptPyDWUITDtAJaevxWJosfstrlWHiDVFNkKAq02IDxdqie8be1ZTrQJ8aG8Ep9

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assets; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    file_url character varying(255) NOT NULL,
    asset_type character varying(50) NOT NULL,
    file_size_kb integer,
    uploaded_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usage_type character varying(50)
);


ALTER TABLE public.assets OWNER TO events_user;

--
-- Name: COLUMN assets.usage_type; Type: COMMENT; Schema: public; Owner: events_user
--

COMMENT ON COLUMN public.assets.usage_type IS 'Type of asset (e.g., gallery_image, event_poster, downloadable_file)';


--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assets_id_seq OWNER TO events_user;

--
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    event_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact_messages OWNER TO events_user;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO events_user;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: event_assets; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.event_assets (
    event_id integer NOT NULL,
    asset_id integer NOT NULL
);


ALTER TABLE public.event_assets OWNER TO events_user;

--
-- Name: event_forms; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.event_forms (
    id integer NOT NULL,
    event_id integer NOT NULL,
    form_id integer NOT NULL,
    usage_context character varying(50) NOT NULL
);


ALTER TABLE public.event_forms OWNER TO events_user;

--
-- Name: event_forms_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.event_forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_forms_id_seq OWNER TO events_user;

--
-- Name: event_forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.event_forms_id_seq OWNED BY public.event_forms.id;


--
-- Name: event_managers; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.event_managers (
    user_id integer NOT NULL,
    event_id integer NOT NULL
);


ALTER TABLE public.event_managers OWNER TO events_user;

--
-- Name: events; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    topic character varying(255),
    description text,
    about_content text,
    contact_content text,
    location character varying(255),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    event_type character varying(50) DEFAULT 'internal'::character varying NOT NULL,
    website_url character varying(255),
    poster_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    api_key uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying(50),
    user_id integer,
    is_active boolean DEFAULT true,
    image character varying(255)
);


ALTER TABLE public.events OWNER TO events_user;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO events_user;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: form_fields; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.form_fields (
    id integer NOT NULL,
    form_id integer NOT NULL,
    label character varying(255) NOT NULL,
    field_type character varying(50) NOT NULL,
    options jsonb,
    is_required boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true
);


ALTER TABLE public.form_fields OWNER TO events_user;

--
-- Name: form_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.form_fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_fields_id_seq OWNER TO events_user;

--
-- Name: form_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.form_fields_id_seq OWNED BY public.form_fields.id;


--
-- Name: forms; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.forms (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    json_definition jsonb NOT NULL
);


ALTER TABLE public.forms OWNER TO events_user;

--
-- Name: forms_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forms_id_seq OWNER TO events_user;

--
-- Name: forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.news (
    id integer NOT NULL,
    event_id integer,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    image_url character varying(255),
    is_general boolean DEFAULT false,
    published_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    tag character varying(50)
);


ALTER TABLE public.news OWNER TO events_user;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO events_user;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: participants; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.participants (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    mobile_number character varying(20),
    otp character varying(255),
    otp_expires_at timestamp with time zone,
    is_mobile_verified boolean DEFAULT false
);


ALTER TABLE public.participants OWNER TO events_user;

--
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participants_id_seq OWNER TO events_user;

--
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- Name: registration_forms; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.registration_forms (
    id integer NOT NULL,
    event_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    form_type character varying(50) DEFAULT 'internal'::character varying NOT NULL,
    external_url character varying(255),
    json_definition jsonb
);


ALTER TABLE public.registration_forms OWNER TO events_user;

--
-- Name: registration_forms_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.registration_forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registration_forms_id_seq OWNER TO events_user;

--
-- Name: registration_forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.registration_forms_id_seq OWNED BY public.registration_forms.id;


--
-- Name: registration_responses; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.registration_responses (
    id integer NOT NULL,
    registration_id integer NOT NULL,
    field_key character varying(255) NOT NULL,
    value jsonb
);


ALTER TABLE public.registration_responses OWNER TO events_user;

--
-- Name: registration_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.registration_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registration_responses_id_seq OWNER TO events_user;

--
-- Name: registration_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.registration_responses_id_seq OWNED BY public.registration_responses.id;


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    event_id integer NOT NULL,
    participant_id integer NOT NULL,
    registration_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registrations OWNER TO events_user;

--
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrations_id_seq OWNER TO events_user;

--
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.site_settings (
    setting_key character varying(100) NOT NULL,
    setting_value text
);


ALTER TABLE public.site_settings OWNER TO events_user;

--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.sponsors (
    id integer NOT NULL,
    event_id integer NOT NULL,
    name character varying(255) NOT NULL,
    logo_url character varying(255),
    website_url character varying(255),
    sponsorship_level character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sponsors OWNER TO events_user;

--
-- Name: sponsors_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.sponsors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sponsors_id_seq OWNER TO events_user;

--
-- Name: sponsors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.sponsors_id_seq OWNED BY public.sponsors.id;


--
-- Name: timeline_items; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.timeline_items (
    id integer NOT NULL,
    event_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    type character varying(50) DEFAULT 'call'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.timeline_items OWNER TO events_user;

--
-- Name: timeline_items_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.timeline_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timeline_items_id_seq OWNER TO events_user;

--
-- Name: timeline_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.timeline_items_id_seq OWNED BY public.timeline_items.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: events_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255),
    role character varying(50) DEFAULT 'event_manager'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    mobile_number character varying(20),
    national_id character varying(11),
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO events_user;

--
-- Name: COLUMN users.is_active; Type: COMMENT; Schema: public; Owner: events_user
--

COMMENT ON COLUMN public.users.is_active IS 'Determines if the user account is active or disabled.';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: events_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO events_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: events_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: event_forms id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_forms ALTER COLUMN id SET DEFAULT nextval('public.event_forms_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: form_fields id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.form_fields ALTER COLUMN id SET DEFAULT nextval('public.form_fields_id_seq'::regclass);


--
-- Name: forms id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- Name: registration_forms id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registration_forms ALTER COLUMN id SET DEFAULT nextval('public.registration_forms_id_seq'::regclass);


--
-- Name: registration_responses id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registration_responses ALTER COLUMN id SET DEFAULT nextval('public.registration_responses_id_seq'::regclass);


--
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- Name: sponsors id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.sponsors ALTER COLUMN id SET DEFAULT nextval('public.sponsors_id_seq'::regclass);


--
-- Name: timeline_items id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.timeline_items ALTER COLUMN id SET DEFAULT nextval('public.timeline_items_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: event_assets event_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_assets
    ADD CONSTRAINT event_assets_pkey PRIMARY KEY (event_id, asset_id);


--
-- Name: event_forms event_forms_event_id_usage_context_key; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_forms
    ADD CONSTRAINT event_forms_event_id_usage_context_key UNIQUE (event_id, usage_context);


--
-- Name: event_forms event_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_forms
    ADD CONSTRAINT event_forms_pkey PRIMARY KEY (id);


--
-- Name: event_managers event_managers_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_managers
    ADD CONSTRAINT event_managers_pkey PRIMARY KEY (user_id, event_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: events events_slug_key; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_slug_key UNIQUE (slug);


--
-- Name: form_fields form_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.form_fields
    ADD CONSTRAINT form_fields_pkey PRIMARY KEY (id);


--
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);


--
-- Name: forms forms_slug_key; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_slug_key UNIQUE (slug);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: participants participants_email_key; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_email_key UNIQUE (email);


--
-- Name: participants participants_mobile_number_key; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_mobile_number_key UNIQUE (mobile_number);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: registration_forms registration_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registration_forms
    ADD CONSTRAINT registration_forms_pkey PRIMARY KEY (id);


--
-- Name: registration_responses registration_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registration_responses
    ADD CONSTRAINT registration_responses_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (setting_key);


--
-- Name: sponsors sponsors_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.sponsors
    ADD CONSTRAINT sponsors_pkey PRIMARY KEY (id);


--
-- Name: timeline_items timeline_items_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.timeline_items
    ADD CONSTRAINT timeline_items_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_event_forms_event_id; Type: INDEX; Schema: public; Owner: events_user
--

CREATE INDEX idx_event_forms_event_id ON public.event_forms USING btree (event_id);


--
-- Name: idx_event_forms_form_id; Type: INDEX; Schema: public; Owner: events_user
--

CREATE INDEX idx_event_forms_form_id ON public.event_forms USING btree (form_id);


--
-- Name: idx_events_api_key; Type: INDEX; Schema: public; Owner: events_user
--

CREATE INDEX idx_events_api_key ON public.events USING btree (api_key);


--
-- Name: idx_registrations_event_id; Type: INDEX; Schema: public; Owner: events_user
--

CREATE INDEX idx_registrations_event_id ON public.registrations USING btree (event_id);


--
-- Name: idx_registrations_participant_id; Type: INDEX; Schema: public; Owner: events_user
--

CREATE INDEX idx_registrations_participant_id ON public.registrations USING btree (participant_id);


--
-- Name: assets assets_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: contact_messages contact_messages_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_assets event_assets_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_assets
    ADD CONSTRAINT event_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- Name: event_assets event_assets_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_assets
    ADD CONSTRAINT event_assets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_managers event_managers_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_managers
    ADD CONSTRAINT event_managers_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_managers event_managers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_managers
    ADD CONSTRAINT event_managers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: registrations fk_event; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_forms fk_event_forms_event; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_forms
    ADD CONSTRAINT fk_event_forms_event FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_forms fk_event_forms_form; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.event_forms
    ADD CONSTRAINT fk_event_forms_form FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: events fk_events_users; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_users FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: registrations fk_participant; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT fk_participant FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: registration_responses fk_registration; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registration_responses
    ADD CONSTRAINT fk_registration FOREIGN KEY (registration_id) REFERENCES public.registrations(id) ON DELETE CASCADE;


--
-- Name: form_fields form_fields_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.form_fields
    ADD CONSTRAINT form_fields_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.registration_forms(id) ON DELETE CASCADE;


--
-- Name: news news_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: registration_forms registration_forms_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.registration_forms
    ADD CONSTRAINT registration_forms_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: sponsors sponsors_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.sponsors
    ADD CONSTRAINT sponsors_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: timeline_items timeline_items_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: events_user
--

ALTER TABLE ONLY public.timeline_items
    ADD CONSTRAINT timeline_items_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO events_user;


--
-- Name: TABLE user_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_sessions TO events_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: events_user
--

ALTER DEFAULT PRIVILEGES FOR ROLE events_user IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES TO events_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: events_user
--

ALTER DEFAULT PRIVILEGES FOR ROLE events_user IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO events_user;


--
-- PostgreSQL database dump complete
--

\unrestrict MptPyDWUITDtAJaevxWJosfstrlWHiDVFNkKAq02IDxdqie8be1ZTrQJ8aG8Ep9

