SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Ye0nbigEboydSE1OhQI1tbmzzJlbcTDhWiJJ0vLNbFc1So8HVORQyYelYz0TKNm

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'b62b0628-d46c-4285-a67c-cf67793786d2', 'authenticated', 'authenticated', 'frank.zeller@cydsa.com', '$2a$10$9/fB5.Qivgzu3sVyZiZEhufk/QvCPXDSC3uVsZkEUah42M4q3l5KO', '2026-07-10 15:59:28.344556+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Frank Zeller", "email_verified": true}', NULL, '2026-07-10 15:59:28.322997+00', '2026-07-10 15:59:28.348629+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5be7438a-1075-473d-a34a-dec6320e2ee0', 'authenticated', 'authenticated', 'ademirluna13@tolkogroup.com', '$2a$10$wQQeKsgRu/23A2mFIh0ecesv4b6j8Ir2tA/OU9zcZmKUDv9TaEisi', '2026-07-09 18:31:36.759495+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Omar Prueba Cliente", "email_verified": true}', NULL, '2026-07-09 18:31:36.732237+00', '2026-07-09 18:31:36.760526+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e55de437-6a6c-45e2-b1f2-607ef41f22fa', 'authenticated', 'authenticated', 'wromero@tolkogroup.com', '$2a$10$EIFEAwIUnTxQewX040dgjubmsRiDUMRFR9EeTiWRNnF9/Jx5Ze7bu', '2026-07-03 20:22:27.031067+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Wendolin Romero", "email_verified": true}', NULL, '2026-07-03 20:22:26.993534+00', '2026-07-03 20:22:27.032154+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'authenticated', 'authenticated', 'bsalgado@tolkogroup.com', '$2a$10$w/sy1F1UT5judumRR1HwkOvL/Uul0qzle260sGJfmVCZk0F/Z4U4y', '2026-07-03 17:23:35.491335+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-16 22:53:33.264989+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Bruno Salgado", "email_verified": true}', NULL, '2026-07-03 17:23:35.484073+00', '2026-07-17 00:01:05.174033+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2072a09e-3804-447f-a7f5-efacc0589e83', 'authenticated', 'authenticated', 'lalberto@tolkogroup.com', '$2a$10$Wl37z0MmRkUj7c4jxZOk5uCMIrDDHfAKxmyIbx18sdFyG2EKh6Nfm', '2026-07-03 19:58:05.707106+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-16 17:22:40.846793+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Lizbeth Alberto", "email_verified": true}', NULL, '2026-07-03 19:58:05.654694+00', '2026-07-17 22:07:46.263266+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'authenticated', 'authenticated', 'xflores@tolkogroup.com', '$2a$10$QCo0clcRoyJN6Z.ZEdQGS.X2kA/Zp.v84EesAD8cniLSQ7q1yCv8m', '2026-07-03 20:55:48.322691+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-15 17:45:05.205274+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Ximena Flores", "email_verified": true}', NULL, '2026-07-03 20:55:48.317603+00', '2026-07-17 20:21:51.856803+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '63d5d908-34a0-4daa-94f4-91cb329f7d17', 'authenticated', 'authenticated', 'mbramirez@tolkogroup.com', '$2a$10$zDFdJHDTy8tgwda.pmUmWOrz2F3TmkCGuchGbRChj4HB15C3SRfpS', '2026-07-03 20:27:30.054779+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 01:27:06.228933+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "María Belén Ramírez", "email_verified": true}', NULL, '2026-07-03 20:27:30.042894+00', '2026-07-17 15:23:56.960196+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '54733af9-6db1-4683-b473-21723c877449', 'authenticated', 'authenticated', 'bbibiano@tolkogroup.com', '$2a$10$3wkDue.VCfwTQc50z.5Q6.5iFWo3zaMRxGIQ4GWLARG/5V.WayQ3K', '2026-07-10 00:13:33.730498+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Brenda Bibiano", "email_verified": true}', NULL, '2026-07-10 00:13:33.698901+00', '2026-07-10 00:13:33.731535+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'authenticated', 'authenticated', 'brunoadmin@tolkogroup.com', '$2a$10$xAnrA664xLwApu7Q8oNlZ.cmGLoIXKvckmcb186Z9dFO0wQDLZ7hy', '2026-07-03 17:21:31.63551+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Bruno Admin", "email_verified": true}', NULL, '2026-07-03 17:21:31.611733+00', '2026-07-03 17:21:31.636521+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'authenticated', 'authenticated', 'asanchez@tolkogroup.com', '$2a$10$qlYvmiWscH9gt3VH8nY2Gek4IHJjoQj3fgrSkyik0YKbQ.alOL1Le', '2026-07-03 20:44:48.159699+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Antonio Sánchez", "email_verified": true}', NULL, '2026-07-03 20:44:48.135573+00', '2026-07-03 20:44:48.160854+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '39181f00-f70d-454a-ab49-d2612488e8f2', 'authenticated', 'authenticated', 'pruebanaxnike@tolkogroup.com', '$2a$10$Zishu5Tdnumy4oLM9Y.sR.eTnKZ9XsDgJMBH8PO1.u/hqiSNZUoFm', '2026-06-25 19:24:08.941893+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-06 19:31:40.995304+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Naxiely Olguin Prueba", "email_verified": true}', NULL, '2026-06-25 19:24:08.918211+00', '2026-07-08 15:30:58.716377+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '806439f5-c268-4ef1-90e0-9c6b20afc521', 'authenticated', 'authenticated', 'mgarcia@tolkogroup.com', '$2a$10$/U6WOtGb6LI6x5CYdaY.Celb6SMUInjomhWy2CgM1Pei/Mn21FlKW', '2026-07-03 20:35:57.039738+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 23:36:24.680978+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Martín García", "email_verified": true}', NULL, '2026-07-03 20:35:57.035043+00', '2026-07-20 15:48:25.976106+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bc8aee4c-21f6-47fb-9a65-f284c78aa7d5', 'authenticated', 'authenticated', 'karem.zamora@grupobimbo.com', '$2a$10$5iAaCxJrZkRO0jGjJzFLluIttHSJD6a62qnksEAqXhaoztlQvoPju', '2026-07-10 00:18:46.63273+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Karem Berenice Zamora Burgos", "email_verified": true}', NULL, '2026-07-10 00:18:46.607113+00', '2026-07-10 00:18:46.633835+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'authenticated', 'authenticated', 'frodriguez@tolkogroup.com', '$2a$10$5j7NJIQwIggmk9/1rjFNweL7zie2el2fdKBXYbIAjORmV0c153z9C', '2026-07-03 17:24:24.382596+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 20:02:10.376077+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fabian Rodriguez", "email_verified": true}', NULL, '2026-07-03 17:24:24.373554+00', '2026-07-20 15:25:14.620387+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ea62dff2-4c5b-43a7-8c10-1ad344e01b3c', 'authenticated', 'authenticated', 'christian.salmeron@posadas.com', '$2a$10$ZxXd5Jyyw/NlxHJcc14rI.69wnftYrp0g0w76dftAQ9kOAP.QFQNC', '2026-07-10 16:03:33.425941+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Salmeron Christian ", "email_verified": true}', NULL, '2026-07-10 16:03:33.401953+00', '2026-07-10 16:03:33.426943+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4d21cc67-d670-4142-9620-032f0dcbecf0', 'authenticated', 'authenticated', 'fmio@novonordisk.com', '$2a$10$Sd4/nBEbrpK.4Yb50yGhQuPfn3dMkHeBlX2BU2yQWpYfKU4XQC7pG', '2026-07-10 16:12:59.007311+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Mauricio Marín Y Kall", "email_verified": true}', NULL, '2026-07-10 16:12:58.985034+00', '2026-07-10 16:12:59.008427+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e74cc442-94cd-4986-84ce-e7d96385b779', 'authenticated', 'authenticated', 'ricado.palacio@enfragen.com', '$2a$10$fP7T30bSyBaSO9ZsDB2IsuIlbxlTjXuEseyfTQSvE.kVnOJAi5pAC', '2026-07-10 16:28:09.230122+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Ricardo Palacio", "email_verified": true}', NULL, '2026-07-10 16:28:09.214034+00', '2026-07-10 16:28:09.231107+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '473016e7-f5e4-451e-a889-8d19a11484f2', 'authenticated', 'authenticated', 'epardo@tolkogroup.com', '$2a$10$9ZhacS/VzMAMKQMA49XiG.DIjEU6qesrzPEV9NE.OiFfjcQf8F3fu', '2026-07-03 20:45:22.25757+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 23:20:24.126797+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Enrique Pardo", "email_verified": true}', NULL, '2026-07-03 20:45:22.25359+00', '2026-07-15 00:39:20.061416+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', 'authenticated', 'authenticated', 'pruebatolko123@gmail.com', '$2a$10$d6H/zv3mnfz.2491P4Hge.x2R4wiRyffLQwC77/RH4166VfPrDnyq', '2026-06-16 16:29:05.502443+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 23:03:45.967717+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Prueba Tolko", "email_verified": true}', NULL, '2026-06-16 16:29:05.451159+00', '2026-07-15 01:31:51.473305+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '8caa4432-c8a5-44fa-bdad-e38613f029e1', 'authenticated', 'authenticated', 'sergio.reyna@grupobimbo.com', '$2a$10$AJntHo1ZUa81/ngF5QtU4OVH9JHYFVNezEBlowc1sorEQmgLOA7J2', '2026-07-16 22:42:47.784249+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Sergio David Reyna", "email_verified": true}', NULL, '2026-07-16 22:42:47.752624+00', '2026-07-16 22:42:47.785219+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', 'authenticated', 'authenticated', 'bbrv@novonordisk.com', '$2a$10$ylCFoomlU0uJZ7pwk.3E2OGNRTJyiJaCyPSMzeOmEToQjJVBwE4dK', '2026-05-28 19:29:34.310642+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 19:32:58.738593+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Brenda Berenice Ramírez Vaca", "email_verified": true}', NULL, '2026-05-28 19:29:34.293551+00', '2026-05-29 14:41:22.140857+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '897e2dd9-2646-4d9e-a20d-f40da228e85e', 'authenticated', 'authenticated', 'shernandez@tolkogroup.com', '$2a$10$gd8klWS64WBxruKd7bsaWezCNcsuhn7ORL8iPVXgbmNDlwuxvHcfG', '2026-07-03 20:24:14.960877+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-16 20:24:16.195953+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Samanta Hernández", "email_verified": true}', NULL, '2026-07-03 20:24:14.945074+00', '2026-07-20 15:31:52.205944+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e2b245b6-ac6b-4811-b24b-2b23dfb0a8be', 'authenticated', 'authenticated', 'nicolas.mariscal@grupobimbo.com', '$2a$10$f5bYXDw5C.0NHuvyDNQsNu4UDr4HFWTDPdc5sMKj30aD5Jeu118R.', '2026-07-10 00:15:07.507536+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Nicolas Mariscal", "email_verified": true}', NULL, '2026-07-10 00:15:07.480095+00', '2026-07-10 00:15:07.508543+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'authenticated', 'authenticated', 'avelez@tolkogroup.com', '$2a$10$4bCETtnRcJtfNH0Iq0CzB.ShC1L61G2ISYZTKD.JZVGgVWtm5Zhjq', '2026-05-28 19:05:24.048944+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-16 18:04:32.876848+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Andrea Velez", "email_verified": true}', NULL, '2026-05-28 19:05:24.043516+00', '2026-07-17 02:15:56.404201+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a6f75547-6426-469a-9248-1489a23c199d', 'authenticated', 'authenticated', 'karina.velasco@alsea.net', '$2a$10$DJmZwwITp/4.QlafjZRWgudGFuKvP2Ckgx32BwXEg/PBX4rSxb21O', '2026-07-09 23:47:54.770127+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-09 23:48:30.542624+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Karina Teruyo Velasco Molina", "email_verified": true}', NULL, '2026-07-09 23:47:54.72073+00', '2026-07-09 23:48:30.550841+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b4c42663-23b0-4426-a256-4deae497e473', 'authenticated', 'authenticated', 'paola.gonzalezc@posadas.com', '$2a$10$aQi2Gug3bg.XI8xMxdKug.Szshjzf8a2/fM/22D8OLXmkvpc91T/y', '2026-07-10 16:05:03.23475+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Gonzalez Paola ", "email_verified": true}', NULL, '2026-07-10 16:05:03.213489+00', '2026-07-10 16:05:03.235789+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'authenticated', 'authenticated', 'msalinas@tolkogroup.com', '$2a$10$HoSVaSsaXPlOTZ1Y7xaU/ugTxuseOcFYcQiGXdtAR4L34ufgK8nRm', '2026-07-03 20:56:49.309398+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-15 17:47:32.363415+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "María del Mar Salinas", "email_verified": true}', NULL, '2026-07-03 20:56:49.28253+00', '2026-07-15 18:49:57.047179+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', 'authenticated', 'authenticated', 'alehernandez@tolkogroup.com', '$2a$10$do/TbesDWHYeY9IrwJsQpODnKTrW4sWzyAUIPWCETrBcyEsFvYVmm', '2026-07-03 20:31:48.230617+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-15 18:51:46.375874+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Alessandra Hernandez", "email_verified": true}', NULL, '2026-07-03 20:31:48.194158+00', '2026-07-16 01:30:35.647858+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'af62bac6-af87-40f4-b02c-cb46fc5d2b52', 'authenticated', 'authenticated', 'andres.vazquez@posadas.com', '$2a$10$/eiu7Cxo6RddTRdypy.mte23ZvN9XWmhcGU0FZhB0.VdQCXivABhS', '2026-07-10 16:02:22.107001+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Vazquez Andres ", "email_verified": true}', NULL, '2026-07-10 16:02:22.0834+00', '2026-07-10 16:02:22.10805+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'authenticated', 'authenticated', 'pruebalider@gmail.com', '$2a$10$RW5Q8DI4fbI9tju.fh2pdOcWw32k5wRSjvtq/hQBGWrk2zT8Rrnry', '2026-06-16 16:31:13.283755+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 18:25:11.519448+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Prueba Lider Tolko", "email_verified": true}', NULL, '2026-06-16 16:31:13.257973+00', '2026-07-17 20:30:57.660968+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '403debcb-7c38-4145-a9ca-3390e1f2b7cd', 'authenticated', 'authenticated', 'mariana.hernandez@cydsa.com', '$2a$10$4PGd.h3kZy7JcH7z6o76TOmpDUNmCaXEYy9/p2.a/KZMYOFMpqI8O', '2026-07-10 15:58:18.336936+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Mariana Hernández", "email_verified": true}', NULL, '2026-07-10 15:58:18.318075+00', '2026-07-10 15:58:18.337966+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '93bb792e-b541-48da-9901-d7e1878fdfb5', 'authenticated', 'authenticated', 'rmarquez@tolkogroup.com', '$2a$10$PWPuQx3K9ulRZf6PZuC6zuWmEQcMertKY7b4w9gK3XYDK1zn6abk2', '2026-07-03 20:37:09.849331+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 19:52:21.164581+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Ramsés Márquez", "email_verified": true}', NULL, '2026-07-03 20:37:09.82886+00', '2026-07-14 23:12:41.317852+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', 'authenticated', 'authenticated', 'oluna@tolkogroup.com', '$2a$10$YBp8NArmwjHRbWp7/x41H.VIb6phd5zscnaNc5rvWMWyPpug5Uv3u', '2026-07-03 17:27:25.92067+00', NULL, '', NULL, '', '2026-07-06 16:16:59.660951+00', '', '', NULL, '2026-07-08 19:24:41.147382+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Omar Luna", "email_verified": true}', NULL, '2026-07-03 17:27:25.908552+00', '2026-07-08 19:24:41.157491+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '000ed70a-a668-4379-82c6-a82e7d523543', 'authenticated', 'authenticated', 'jcornejo@tolkogroup.com', '$2a$10$TtjvuLSnXLz3fqTA0rXx.Oah.LdZq0AnODqf.B5j6JRa7tmbi1HuC', '2026-07-14 19:54:26.99106+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 20:04:40.506797+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Jared Cornejo", "email_verified": true}', NULL, '2026-07-14 19:54:26.939589+00', '2026-07-20 16:36:30.559991+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'cc5d4b45-dd70-48d5-9cbe-3eb98539ac15', 'authenticated', 'authenticated', 'sofia.vazquez@nike.com', '$2a$10$gwTcYMOvAgkXdj/jZatqhOmNyFhgHEUs7MUz5tTSCEFI9hUeMVFYq', '2026-07-10 16:05:54.75414+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Sofía Vazquez", "email_verified": true}', NULL, '2026-07-10 16:05:54.749231+00', '2026-07-10 16:05:54.754943+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '9712dc1c-b1e0-4ee5-a42e-b7696677bf2b', 'authenticated', 'authenticated', 'pruebaandy@tolkogroup.com', '$2a$10$BXcpZmnneHDW9Ik3rfvcWufz95XODqA0xTulJk66CP/cP.bQZz/NC', '2026-06-25 19:32:45.922812+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-25 22:59:25.58941+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Prueba Andrea Velez", "email_verified": true}', NULL, '2026-06-25 19:32:45.908307+00', '2026-07-10 16:14:24.43982+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'befb88e9-fd13-4f79-9622-d6c6bdd52be7', 'authenticated', 'authenticated', 'svgx@novonordisk.com', '$2a$10$ddicDk2Dut2IoTDVu9DSMePx8.9eqHKkHtbEvjv2TCVS9zE3tiOUi', '2026-07-10 16:23:05.064573+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Liyen Chávez", "email_verified": true}', NULL, '2026-07-10 16:23:05.033043+00', '2026-07-10 16:23:05.065703+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '989c4298-86d3-416a-998f-2e82b3f9e553', 'authenticated', 'authenticated', 'direcciongeneral@amsofipo.mx', '$2a$10$A4SDOFKe6rB8HN3EW7gJ/eh.LN8tlnm4ugwoqvPl4/lBtNoafaXpC', '2026-07-16 16:36:00.099473+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Miriam Chávez", "email_verified": true}', NULL, '2026-07-16 16:36:00.060509+00', '2026-07-16 16:36:00.102496+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0f0eca6a-1cc7-42d9-959b-2544cb036d36', 'authenticated', 'authenticated', 'juan.cruz@enfragen.com', '$2a$10$QzefXBKH8SLVNpQHYT6hGeqtmlmBGwfjIUXw1joc5T51X0o9pUMzS', '2026-07-10 16:28:54.152013+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Juan Manuel Cruz", "email_verified": true}', NULL, '2026-07-10 16:28:54.119201+00', '2026-07-10 16:28:54.152953+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4601c73d-a873-4b9f-901b-0998d5536c9c', 'authenticated', 'authenticated', 'eespinosa@tolkogroup.com', '$2a$10$c9FVNgxNq.gvgJ3tmNsif.3MKbr6yOj0eCm7zgdT4F9BIdZYuT6vy', '2026-07-03 20:41:09.459653+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-15 22:52:18.005624+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Eduardo Espinosa", "email_verified": true}', NULL, '2026-07-03 20:41:09.412827+00', '2026-07-16 16:26:11.279133+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'authenticated', 'authenticated', 'sserrano@tolkogroup.com', '$2a$10$l1T03D13pi6NxhjL8355Pe2AjUxtYz1ENBVcFnTGN9SDUgVB19WR.', '2026-05-28 19:03:57.323895+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-16 23:06:20.7234+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Sergio Serrano", "email_verified": true}', NULL, '2026-05-28 19:03:57.315816+00', '2026-07-16 23:06:20.737043+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5a4795df-85a2-4846-b2af-68899c613610', 'authenticated', 'authenticated', 'kdelao@tolkogroup.com', '$2a$10$fj4W3Ow3YkuTw8yzg8thYOzVejTW.deWMQg9.frzlAjne/eeYE80a', '2026-07-03 20:41:47.244927+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Kevin de la O", "email_verified": true}', NULL, '2026-07-03 20:41:47.238516+00', '2026-07-03 20:41:47.245909+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', 'authenticated', 'authenticated', 'vrodriguez@tolkogroup.com', '$2a$10$5awNKNRnurTenVzs3BIPMe8E3LO5T9WdfgEHYZsw0MV4PK4fDwpii', '2026-07-03 20:58:57.327806+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 20:36:18.936406+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Verónica Rodríguez", "email_verified": true}', NULL, '2026-07-03 20:58:57.30711+00', '2026-07-17 22:04:17.477583+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7dc57b73-9e2d-4c2a-9447-f5c8d49a9909', 'authenticated', 'authenticated', 'smendez@tolkogroup.com', '$2a$10$EZShOe9fRoj2XlE7s.Wk/.rlGZSEzx5eZ7w//fmYKE5PMFYON6IGC', '2026-07-03 20:25:31.488308+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Scarlett Mendez", "email_verified": true}', NULL, '2026-07-03 20:25:31.484643+00', '2026-07-03 20:25:31.489226+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '56ea6af7-d061-4ea7-8793-72641fba5d91', 'authenticated', 'authenticated', 'iavila@tolkogroup.com', '$2a$10$4cFPGVhZL4eavQG1oXSLveh1V5tXeMRk.gx4mSGOxMzHWhEdNm0.m', '2026-07-03 20:42:24.345991+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 15:41:27.440489+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Iván Ávila", "email_verified": true}', NULL, '2026-07-03 20:42:24.340626+00', '2026-07-17 15:41:27.470215+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'authenticated', 'authenticated', 'mvega@tolkogroup.com', '$2a$10$ikFecHib3vfldCiizjw5yeTtVm3boPcx9hTPDQPiELkadAol4Rdke', '2026-07-03 20:53:31.359111+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-15 16:10:06.956819+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Mariana Vega", "email_verified": true}', NULL, '2026-07-03 20:53:31.306555+00', '2026-07-20 15:56:38.453064+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6901712f-b020-4eec-83eb-13d1eff277c0', 'authenticated', 'authenticated', 'clazcano@tolkogroup.com', '$2a$10$nZOgTIfVPuxJUSz/2pRoy.hogcYPqht6izw54JLPyyu.X8O6qc9iO', '2026-07-03 17:28:19.925029+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-20 15:56:49.192931+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Cinthia Lazcano", "email_verified": true}', NULL, '2026-07-03 17:28:19.876284+00', '2026-07-20 15:56:49.212508+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'authenticated', 'authenticated', 'nolguin@tolkogroup.com', '$2a$10$sWks0jhmdj0va9BI23IAzu/sNODH/ANft3HVmffP/z0zGF1HK/u.6', '2026-05-28 19:14:07.858279+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 17:38:52.21226+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Naxiely Olguin", "email_verified": true}', NULL, '2026-05-28 19:14:07.832024+00', '2026-07-17 17:38:52.21597+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'authenticated', 'authenticated', 'fabianadmin@tolkogroup.com', '$2a$10$xlJq3WwLpYyCRo55qS/CRuZYpjuz0xTgsGSpw5S0fma0MUEelEKHW', '2026-07-03 17:19:07.826402+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 16:46:14.802188+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fabian Admin", "email_verified": true}', NULL, '2026-07-03 17:19:07.823672+00', '2026-07-17 16:46:14.844095+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', 'authenticated', 'authenticated', 'lcastillo@tolkogroup.com', '$2a$10$0Ap1uz59b0LXkwp6xK3ABep7RRvdB1R.R2ogBWbimMOWXNFXWMAnW', '2026-07-03 20:34:48.051775+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-16 15:32:18.464549+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Luis Ernesto Castillo", "email_verified": true}', NULL, '2026-07-03 20:34:48.038611+00', '2026-07-17 17:01:32.942338+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', 'authenticated', 'authenticated', 'climon@tolkogroup.com', '$2a$10$yHIp0QWYbrKMhim9dth4B.I/mLCCU.PpOmdxcMuyORSbbeOxixqhS', '2026-07-03 20:59:37.129983+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 20:15:49.640675+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Carlos Limón", "email_verified": true}', NULL, '2026-07-03 20:59:37.127163+00', '2026-07-16 00:07:47.937502+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', 'authenticated', 'authenticated', 'gmorales@tolkogroup.com', '$2a$10$04dqC7UaXTk2YDGRoeFsZOyZgWZcfJByBT9MMVbJ3grVpXofvWT2.', '2026-07-03 17:48:01.918677+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-14 19:50:21.204277+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Elí Morales", "email_verified": true}', NULL, '2026-07-03 17:48:01.884281+00', '2026-07-15 22:55:34.020572+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '38fc9683-4851-42fd-9d97-a73e1fecfde9', 'authenticated', 'authenticated', 'melissa.martinez@nike.com', '$2a$10$eC7SX4nhLhwnmx9Ccv7ac.p/qUeLPq/2ih1IQWQngV4//4A5KRLci', '2026-05-28 19:56:34.441364+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-25 18:18:51.973958+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Melissa Martínez", "email_verified": true}', NULL, '2026-05-28 19:56:34.423519+00', '2026-06-25 19:27:51.262239+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3e49085a-6eaa-456c-9d53-6997d4d30491', 'authenticated', 'authenticated', 'daniela.juarez@alsea.net', '$2a$10$sJ6WqN7bombDhTZB4Qbtf.OS2uZGBIq6XYHtKsbZMEohLv9CBgNuG', '2026-07-10 00:03:29.394469+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Daniela Paola Juarez Martinez", "email_verified": true}', NULL, '2026-07-10 00:03:29.365237+00', '2026-07-10 00:03:29.395401+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ae004f1d-7201-490d-825b-2e5e1babee6c', 'authenticated', 'authenticated', 'maria.e.ramirez@grupobimbo.com', '$2a$10$TwljrSGefoshxx38QL1OOemi.1ivSyuJLxSuKSrQWvyTnNhtjk4W.', '2026-07-10 00:16:14.974826+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "María Elena Ramirez", "email_verified": true}', NULL, '2026-07-10 00:16:14.942691+00', '2026-07-10 00:16:14.976028+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '059a17b9-b1cc-4e43-b125-8d9496ffa8c3', 'authenticated', 'authenticated', 'lgarcia@tolkogroup.com', '$2a$10$a84sWfOQ2lFmC5zwuWac..jbkzbyT.bVekYSG57yfa081T.p1LKRG', '2026-07-03 20:58:16.421236+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-15 00:02:14.566869+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Laura García", "email_verified": true}', NULL, '2026-07-03 20:58:16.407856+00', '2026-07-15 01:08:27.40825+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6589ea5b-6c12-4aff-889c-16d125c2ec99', 'authenticated', 'authenticated', 'ivonne.castro@grupobimbo.com', '$2a$10$9CSjxwuFLJRaHet/RdYcm.EdQk22vRULZ9/0SJGC88AUTuxW9hI06', '2026-07-10 00:16:51.357712+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Ivonne Livier Castro Varela", "email_verified": true}', NULL, '2026-07-10 00:16:51.352584+00', '2026-07-10 00:16:51.358622+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0be8c39b-72f0-4d3e-90ec-6713ed8f1325', 'authenticated', 'authenticated', 'aerazo@biopappel.com', '$2a$10$r4I673k6PkQNSsgoq3uY8OoG7jWrLzUWZXfAr5UTs6PGH/PeEYqsu', '2026-07-16 16:36:33.227384+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Adriana Erazo", "email_verified": true}', NULL, '2026-07-16 16:36:33.223009+00', '2026-07-16 16:36:33.228076+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b19cca69-3f8c-4e00-929a-58df124275bc', 'authenticated', 'authenticated', 'pruebaxime123@tolkogroup.com', '$2a$10$z7xjovNGUXpmvnSPI1tsJeyblsQg7JvmaBzLS4YVHGSDBn2pJuuHy', '2026-06-25 19:07:10.892892+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-15 00:57:09.494005+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Ximena Flores", "email_verified": true}', NULL, '2026-06-25 19:07:10.844196+00', '2026-07-15 00:57:09.508521+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'authenticated', 'authenticated', 'floresvaleria@la-bridgestone.com', '$2a$10$42DrwPjSJOUCzsfwFvjOdOeuVEBL1AXoXW8oS3fc9YKrmc2lk5HPe', '2026-07-14 23:29:18.504717+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Valeria Flores", "email_verified": true}', NULL, '2026-07-14 23:29:18.474996+00', '2026-07-14 23:29:18.505745+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '198c855a-2872-44f0-8153-f7c60c93f299', 'authenticated', 'authenticated', 'lucas.lagos@enfragen.com', '$2a$10$SQvFJhozmCKeJnNOjbG2Ve9J1V7kQeQdcapceKOZHZuuB1GQrTPOG', '2026-07-10 16:29:39.232415+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Lucas Lagos", "email_verified": true}', NULL, '2026-07-10 16:29:39.213455+00', '2026-07-10 16:29:39.234552+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '946ce820-aea2-495b-8856-9593826d2994', 'authenticated', 'authenticated', 'a.fares@ebc.edu.mx', '$2a$10$EQkaecJQxlyUw0kSNLVale5RnfB1wSt.zf5D566MZ8HzLJY5rdBWG', '2026-07-16 16:49:57.585463+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Arelí Fares", "email_verified": true}', NULL, '2026-07-16 16:49:57.551072+00', '2026-07-16 16:49:57.586467+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'debcf540-88f6-4536-bd0f-5b30f2aa4141', 'authenticated', 'authenticated', 'abejar@biopappel.com', '$2a$10$S6cpjUsK/WvXybBqlD6cOeNzYxPoaLOH7EgoW3o5X8nlObhkQNiUK', '2026-07-16 16:36:57.24021+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Andrea Béjar", "email_verified": true}', NULL, '2026-07-16 16:36:57.231822+00', '2026-07-16 16:36:57.241041+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '156d7e1c-904f-41d9-975e-58fbc686f677', 'authenticated', 'authenticated', 'arleth.garces@enfragen.com', '$2a$10$/MzwOGTme/wfow1YZIiGvudGyhoQZpPcxwpSdxA/z2G4tMuKVw8a.', '2026-07-10 16:30:55.276123+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Patricia Garcés", "email_verified": true}', NULL, '2026-07-10 16:30:55.243246+00', '2026-07-10 16:30:55.277449+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c5711c22-a164-4d7f-8ad3-089635cb544c', 'authenticated', 'authenticated', 'paulina.ramirez@crediclub.com', '$2a$10$k6scoAnuh3GG1MDDeQbCV.tKK.Vm24VBjueY.KCeNSC6ptwXQOpPK', '2026-07-16 16:38:55.12346+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Paulina Ramírez", "email_verified": true}', NULL, '2026-07-16 16:38:55.120333+00', '2026-07-16 16:38:55.124088+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd4fdb7c2-714a-40cc-bc4a-4299a20e0627', 'authenticated', 'authenticated', 'arosellon@biopappel.com', '$2a$10$rS77gRg3MWdzmFHLRqDjXe8p16cbHZ8rJQ3sZZFeyXsLOooPNxQ6a', '2026-07-16 16:37:23.556888+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Andrea Rosellón", "email_verified": true}', NULL, '2026-07-16 16:37:23.553936+00', '2026-07-16 16:37:23.55768+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7f4722ee-e0f8-44d8-ba09-32b37055f8a2', 'authenticated', 'authenticated', 'natalia.jimenez@glenfarnecompanies.com', '$2a$10$sU.QsPEjuq.5p/qodT8APe6GS19jXuH.YDPu30080aebkpDBVSKFW', '2026-07-10 16:32:54.941841+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Natalia Jiménez", "email_verified": true}', NULL, '2026-07-10 16:32:54.920011+00', '2026-07-10 16:32:54.943022+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bef74040-1279-4b76-8cd8-497e37711cd9', 'authenticated', 'authenticated', 'eva.barbosa@bayer.com', '$2a$10$dy1tGmbqpGY4lW9fGnQwQ.NXGKw6pvxdIr.FJVh9PxPrp1F1F4T5C', '2026-07-16 16:40:12.041808+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Eva Barbosa ", "email_verified": true}', NULL, '2026-07-16 16:40:12.039173+00', '2026-07-16 16:40:12.046731+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '45e18393-6642-47cc-b1dc-e0595089eb85', 'authenticated', 'authenticated', 'andres.bonilla@glenfarnecompanies.com', '$2a$10$uCI/P4kIHYG9cKeZBLDbFOYx2RV3u/chfIE.Dy8WBLE6qlYTnFD8u', '2026-07-10 16:37:18.52023+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Andrés Bonilla", "email_verified": true}', NULL, '2026-07-10 16:37:18.484261+00', '2026-07-10 16:37:18.521205+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd32486d5-9d77-4934-9130-913398aa0ecc', 'authenticated', 'authenticated', 'epadilla@biopappel.com', '$2a$10$qRmi8cUdb4kydzXFuQAxG.MY3uicEoZMrGpk9eBd8AggXzx/pOaVe', '2026-07-16 16:37:47.129156+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Erick Padilla", "email_verified": true}', NULL, '2026-07-16 16:37:47.11659+00', '2026-07-16 16:37:47.138765+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '98dcd0ea-33e1-430d-b0ee-15e9211e0849', 'authenticated', 'authenticated', 'soniag@amib.com.mx', '$2a$10$/Zf1GmpZXmY.ESi18FBYBOmi7qfOOHjFfAK9t7j2TZzxX6W6zl4SG', '2026-07-16 16:39:34.521672+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Sonia García ", "email_verified": true}', NULL, '2026-07-16 16:39:34.514897+00', '2026-07-16 16:39:34.5229+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd946a934-56bd-4e23-b527-c27c927ec455', 'authenticated', 'authenticated', 'natalia.gualteros@glenfarne.com', '$2a$10$NIT.7KgEdIfa/9igO969EutRj7MamGYn1EHMTDpXKPU8Lb4FueOtq', '2026-07-10 16:38:13.176195+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Natalia Gualteros", "email_verified": true}', NULL, '2026-07-10 16:38:13.173462+00', '2026-07-10 16:38:13.176922+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'authenticated', 'authenticated', 'omaradmin@tolkogroup.com', '$2a$10$OS4wPAg3VcW7t8GjSAErUO.417QI.xscmRUvRI9Eiww6.0krEaI3e', '2026-07-03 17:18:09.496159+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 19:05:08.081101+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Omar Admin", "email_verified": true}', NULL, '2026-07-03 17:18:09.44947+00', '2026-07-17 20:03:28.67025+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6996baad-8277-4c4b-b1c8-cbc4fac1005b', 'authenticated', 'authenticated', 'regina.velarde@crediclub.com', '$2a$10$I5p5G6EYDkypkiixmI0FF.yd7O6vPCqFP3Kz3ape5o660JNKg5bzy', '2026-07-16 16:38:26.737824+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Regina García Velarde", "email_verified": true}', NULL, '2026-07-16 16:38:26.735207+00', '2026-07-16 16:38:26.738622+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd35996b1-2855-424e-bb6e-08d14a02b323', 'authenticated', 'authenticated', 'lorena.gallardo@bayer.com', '$2a$10$OD6aQ5dMCeq8rNJixk/4q.eWOOChYBKp9Jhql39o4MzU6uSpl067m', '2026-07-16 16:40:51.124347+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Lorena Gallardo ", "email_verified": true}', NULL, '2026-07-16 16:40:51.122011+00', '2026-07-16 16:40:51.124991+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e8a43ce5-b3fa-4b23-a8af-256872323fd5', 'authenticated', 'authenticated', 'bcastillejos@amib.com.mx', '$2a$10$vwz46rCp0/s9HnAtMgAz6OYW1U9qz.WVGjnHkIC2aPxxPrbVfjGPu', '2026-07-16 16:39:53.823078+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Berenice Castillejos ", "email_verified": true}', NULL, '2026-07-16 16:39:53.797748+00', '2026-07-16 16:39:53.823828+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7a36964d-aefa-49e3-938c-167fcec411a0', 'authenticated', 'authenticated', 'catalina.rodriguez1@bayer.com', '$2a$10$r0mfFMCLAhLfFZp23LH19OvcdoSr4kaAC1xJvFeH16Q3uaqmq/V8u', '2026-07-16 16:40:32.657156+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Catalina Rodríguez", "email_verified": true}', NULL, '2026-07-16 16:40:32.654795+00', '2026-07-16 16:40:32.657832+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '75229c3d-19e2-47e0-b351-8e588d6f674d', 'authenticated', 'authenticated', 'p.zaragoza001@ebc.edu.mx', '$2a$10$deCMuxCxIckdRpIYCxTIBOYEOwJUHHUsygjv9XEwC9X75eV7GbDyO', '2026-07-16 16:50:17.539743+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Paulety Zaragoza", "email_verified": true}', NULL, '2026-07-16 16:50:17.532504+00', '2026-07-16 16:50:17.540584+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '404e4037-6517-4a5e-b6e5-0f91dccf4aae', 'authenticated', 'authenticated', 'g.rodriguez077@ebc.edu.mx', '$2a$10$ahOsM0wweC27MYPeSbSjAex/qmqIZgJ06tDzzB5rKE2uLYRQJrxSu', '2026-07-16 16:50:36.232889+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Georgina Rodríguez", "email_verified": true}', NULL, '2026-07-16 16:50:36.2289+00', '2026-07-16 16:50:36.233727+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'authenticated', 'authenticated', 'dpalma@tolkogroup.com', '$2a$10$s4QoStW7Hx1gYSAHZCG1uOWtcB3iGJG1.sM15LQ0HBbtNSD416Yj6', '2026-07-03 20:52:04.733774+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-17 17:39:24.976624+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Daniela Palma", "email_verified": true}', NULL, '2026-07-03 20:52:04.695758+00', '2026-07-17 17:39:24.992892+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e19b0182-0a1e-4637-b85d-ba337ba2d133', 'authenticated', 'authenticated', 'karla.heras@grupobimbo.com', '$2a$10$lxaDefN8QbjuZ23P.8ErKe5p.uCPLMxyVO1FbbpaF2NpsK/24ZyRi', '2026-07-16 22:38:29.616245+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Karla Heras", "email_verified": true}', NULL, '2026-07-16 22:38:29.574579+00', '2026-07-16 22:38:29.617247+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a5709d48-d774-42b3-bf57-5e061ff25d87', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '{"sub": "a5709d48-d774-42b3-bf57-5e061ff25d87", "email": "sserrano@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-28 19:03:57.321734+00', '2026-05-28 19:03:57.321807+00', '2026-05-28 19:03:57.321807+00', '90d9c7f9-0ac0-4d6d-8e21-23cac3fdf8e2'),
	('855ecf57-5a53-4e36-91db-d4e607a8bb42', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '{"sub": "855ecf57-5a53-4e36-91db-d4e607a8bb42", "email": "avelez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-28 19:05:24.045177+00', '2026-05-28 19:05:24.045226+00', '2026-05-28 19:05:24.045226+00', '7167a7bc-c3b3-429d-8b2b-10fd9a33383d'),
	('83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '{"sub": "83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a", "email": "nolguin@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-28 19:14:07.851055+00', '2026-05-28 19:14:07.855043+00', '2026-05-28 19:14:07.855043+00', '1edae1a9-823d-42eb-9c4c-4885bf62e62b'),
	('6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', '{"sub": "6ccbf9a0-634f-4a94-a6ac-9c1187a6557a", "email": "bbrv@novonordisk.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-28 19:29:34.305478+00', '2026-05-28 19:29:34.305548+00', '2026-05-28 19:29:34.305548+00', 'bac4fd62-bb25-4a04-ac66-2c0737f5b4c0'),
	('38fc9683-4851-42fd-9d97-a73e1fecfde9', '38fc9683-4851-42fd-9d97-a73e1fecfde9', '{"sub": "38fc9683-4851-42fd-9d97-a73e1fecfde9", "email": "melissa.martinez@nike.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-28 19:56:34.434644+00', '2026-05-28 19:56:34.434702+00', '2026-05-28 19:56:34.434702+00', '36978684-aeaa-440b-a970-924daf639a95'),
	('0266ac4d-b3e8-45fa-b994-aab1020f13f6', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', '{"sub": "0266ac4d-b3e8-45fa-b994-aab1020f13f6", "email": "pruebatolko123@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-16 16:29:05.485314+00', '2026-06-16 16:29:05.485393+00', '2026-06-16 16:29:05.485393+00', '3823e248-27ef-4391-85c9-a2ff22959e43'),
	('aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', '{"sub": "aea4aba1-5f0f-4548-8a56-80b3fef4987f", "email": "pruebalider@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-16 16:31:13.277525+00', '2026-06-16 16:31:13.277587+00', '2026-06-16 16:31:13.277587+00', 'f34963aa-c59c-4927-a993-bfb38bbd92a1'),
	('b19cca69-3f8c-4e00-929a-58df124275bc', 'b19cca69-3f8c-4e00-929a-58df124275bc', '{"sub": "b19cca69-3f8c-4e00-929a-58df124275bc", "email": "pruebaxime123@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-25 19:07:10.885062+00', '2026-06-25 19:07:10.885171+00', '2026-06-25 19:07:10.885171+00', '3c28c364-de4a-4fca-9e8c-37f83ce43c60'),
	('39181f00-f70d-454a-ab49-d2612488e8f2', '39181f00-f70d-454a-ab49-d2612488e8f2', '{"sub": "39181f00-f70d-454a-ab49-d2612488e8f2", "email": "pruebanaxnike@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-25 19:24:08.93477+00', '2026-06-25 19:24:08.93485+00', '2026-06-25 19:24:08.93485+00', 'd0f68169-8699-4432-9fa4-9abd6952c25a'),
	('9712dc1c-b1e0-4ee5-a42e-b7696677bf2b', '9712dc1c-b1e0-4ee5-a42e-b7696677bf2b', '{"sub": "9712dc1c-b1e0-4ee5-a42e-b7696677bf2b", "email": "pruebaandy@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-25 19:32:45.918097+00', '2026-06-25 19:32:45.918169+00', '2026-06-25 19:32:45.918169+00', '5455963e-475b-4842-8c3e-4165a90f2b8b'),
	('7e6ae7be-9b76-4400-94b1-a6571016ca87', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '{"sub": "7e6ae7be-9b76-4400-94b1-a6571016ca87", "email": "omaradmin@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:18:09.486481+00', '2026-07-03 17:18:09.486535+00', '2026-07-03 17:18:09.486535+00', '4e0b4550-2795-44c0-ae1b-eaacde6acc04'),
	('1b33a1a2-59e1-4fcb-9096-2120f07677e8', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{"sub": "1b33a1a2-59e1-4fcb-9096-2120f07677e8", "email": "fabianadmin@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:19:07.824968+00', '2026-07-03 17:19:07.825013+00', '2026-07-03 17:19:07.825013+00', 'd9c72768-9be2-4a9e-accc-bcc1d7440597'),
	('5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', '{"sub": "5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd", "email": "brunoadmin@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:21:31.624602+00', '2026-07-03 17:21:31.624663+00', '2026-07-03 17:21:31.624663+00', '292a8d8a-1178-4a6a-bfd7-3b92c4e9044a'),
	('c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '{"sub": "c0205e85-fe64-42e1-ae3b-e68c15e301c8", "email": "bsalgado@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:23:35.488417+00', '2026-07-03 17:23:35.488482+00', '2026-07-03 17:23:35.488482+00', '850912ae-6105-4a96-a734-5725d68b92b4'),
	('17d5d747-fdd1-4d4f-88cc-aa2909995088', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '{"sub": "17d5d747-fdd1-4d4f-88cc-aa2909995088", "email": "frodriguez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:24:24.379992+00', '2026-07-03 17:24:24.380053+00', '2026-07-03 17:24:24.380053+00', '327b7edd-970d-4773-9391-f5dc2ab2c9ac'),
	('0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '{"sub": "0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb", "email": "oluna@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:27:25.918467+00', '2026-07-03 17:27:25.918521+00', '2026-07-03 17:27:25.918521+00', '4c80f246-26af-4e5f-b9e7-e45a085fbf9b'),
	('6901712f-b020-4eec-83eb-13d1eff277c0', '6901712f-b020-4eec-83eb-13d1eff277c0', '{"sub": "6901712f-b020-4eec-83eb-13d1eff277c0", "email": "clazcano@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:28:19.908704+00', '2026-07-03 17:28:19.908788+00', '2026-07-03 17:28:19.908788+00', 'ff9decb4-a8a9-4ad6-83b7-2c19350d0f27'),
	('b049d400-3d04-42c5-85c8-3c8732cf7ae7', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '{"sub": "b049d400-3d04-42c5-85c8-3c8732cf7ae7", "email": "gmorales@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 17:48:01.910881+00', '2026-07-03 17:48:01.910945+00', '2026-07-03 17:48:01.910945+00', '6563df7d-f28c-40bc-806d-67c64cd668a7'),
	('2072a09e-3804-447f-a7f5-efacc0589e83', '2072a09e-3804-447f-a7f5-efacc0589e83', '{"sub": "2072a09e-3804-447f-a7f5-efacc0589e83", "email": "lalberto@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 19:58:05.696478+00', '2026-07-03 19:58:05.696532+00', '2026-07-03 19:58:05.696532+00', 'f752679c-0fbc-4d89-81a2-7a26c5e115ca'),
	('e55de437-6a6c-45e2-b1f2-607ef41f22fa', 'e55de437-6a6c-45e2-b1f2-607ef41f22fa', '{"sub": "e55de437-6a6c-45e2-b1f2-607ef41f22fa", "email": "wromero@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:22:27.022115+00', '2026-07-03 20:22:27.022181+00', '2026-07-03 20:22:27.022181+00', '820e9269-647c-4233-b909-df06318f749e'),
	('897e2dd9-2646-4d9e-a20d-f40da228e85e', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '{"sub": "897e2dd9-2646-4d9e-a20d-f40da228e85e", "email": "shernandez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:24:14.958167+00', '2026-07-03 20:24:14.958219+00', '2026-07-03 20:24:14.958219+00', '7dd03636-4ab6-44f1-97e6-4c60c35e108f'),
	('7dc57b73-9e2d-4c2a-9447-f5c8d49a9909', '7dc57b73-9e2d-4c2a-9447-f5c8d49a9909', '{"sub": "7dc57b73-9e2d-4c2a-9447-f5c8d49a9909", "email": "smendez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:25:31.486254+00', '2026-07-03 20:25:31.486303+00', '2026-07-03 20:25:31.486303+00', '815367cc-f844-40b3-bc1c-3547b4be6dfb'),
	('63d5d908-34a0-4daa-94f4-91cb329f7d17', '63d5d908-34a0-4daa-94f4-91cb329f7d17', '{"sub": "63d5d908-34a0-4daa-94f4-91cb329f7d17", "email": "mbramirez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:27:30.052635+00', '2026-07-03 20:27:30.052693+00', '2026-07-03 20:27:30.052693+00', '043dcad5-ebd6-43b8-92d7-c8792f86d112'),
	('9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', '{"sub": "9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a", "email": "alehernandez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:31:48.225566+00', '2026-07-03 20:31:48.225623+00', '2026-07-03 20:31:48.225623+00', '3008d160-58b2-438f-ac73-e0526354ec50'),
	('6d346f9b-3c06-47bb-9c2f-243bcc93b744', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', '{"sub": "6d346f9b-3c06-47bb-9c2f-243bcc93b744", "email": "lcastillo@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:34:48.048459+00', '2026-07-03 20:34:48.048517+00', '2026-07-03 20:34:48.048517+00', '82f99e0a-c204-4b58-b93d-7e929f10b8d4'),
	('806439f5-c268-4ef1-90e0-9c6b20afc521', '806439f5-c268-4ef1-90e0-9c6b20afc521', '{"sub": "806439f5-c268-4ef1-90e0-9c6b20afc521", "email": "mgarcia@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:35:57.03769+00', '2026-07-03 20:35:57.037746+00', '2026-07-03 20:35:57.037746+00', '96e21d04-1e79-40f8-8652-32dc657953c3'),
	('93bb792e-b541-48da-9901-d7e1878fdfb5', '93bb792e-b541-48da-9901-d7e1878fdfb5', '{"sub": "93bb792e-b541-48da-9901-d7e1878fdfb5", "email": "rmarquez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:37:09.842412+00', '2026-07-03 20:37:09.842487+00', '2026-07-03 20:37:09.842487+00', 'b82b7459-8f2f-4eff-811d-353d9b3ff491'),
	('4601c73d-a873-4b9f-901b-0998d5536c9c', '4601c73d-a873-4b9f-901b-0998d5536c9c', '{"sub": "4601c73d-a873-4b9f-901b-0998d5536c9c", "email": "eespinosa@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:41:09.441108+00', '2026-07-03 20:41:09.441164+00', '2026-07-03 20:41:09.441164+00', '016e93d2-b150-490f-a2fa-2c3680e980e5'),
	('5a4795df-85a2-4846-b2af-68899c613610', '5a4795df-85a2-4846-b2af-68899c613610', '{"sub": "5a4795df-85a2-4846-b2af-68899c613610", "email": "kdelao@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:41:47.243108+00', '2026-07-03 20:41:47.243158+00', '2026-07-03 20:41:47.243158+00', '28184d74-776b-4d2d-b394-fcc3bcfa9400'),
	('56ea6af7-d061-4ea7-8793-72641fba5d91', '56ea6af7-d061-4ea7-8793-72641fba5d91', '{"sub": "56ea6af7-d061-4ea7-8793-72641fba5d91", "email": "iavila@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:42:24.343898+00', '2026-07-03 20:42:24.34395+00', '2026-07-03 20:42:24.34395+00', '0a895eec-5ae5-4d27-9edd-c67bf12f39f1'),
	('79296d44-1dcc-43ae-9b98-d94378ed37c0', '79296d44-1dcc-43ae-9b98-d94378ed37c0', '{"sub": "79296d44-1dcc-43ae-9b98-d94378ed37c0", "email": "asanchez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:44:48.155151+00', '2026-07-03 20:44:48.155257+00', '2026-07-03 20:44:48.155257+00', '77eb08a0-8e1d-4026-b377-30cd822c2c95'),
	('473016e7-f5e4-451e-a889-8d19a11484f2', '473016e7-f5e4-451e-a889-8d19a11484f2', '{"sub": "473016e7-f5e4-451e-a889-8d19a11484f2", "email": "epardo@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:45:22.255981+00', '2026-07-03 20:45:22.256029+00', '2026-07-03 20:45:22.256029+00', '825101b6-9215-4aa8-863c-43ad63e0ec32'),
	('2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '{"sub": "2ae3b814-56ed-43f9-9ccb-bbdee48022f8", "email": "dpalma@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:52:04.727914+00', '2026-07-03 20:52:04.727968+00', '2026-07-03 20:52:04.727968+00', '0b3a843b-6efd-4b23-ab1f-075aebf2ee9a'),
	('4b4cc46b-65be-4faa-9d06-81e4d6893343', '4b4cc46b-65be-4faa-9d06-81e4d6893343', '{"sub": "4b4cc46b-65be-4faa-9d06-81e4d6893343", "email": "mvega@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:53:31.351045+00', '2026-07-03 20:53:31.351101+00', '2026-07-03 20:53:31.351101+00', 'e40b9383-50e9-4c59-b1ac-b4cbd6e7e0c1'),
	('e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '{"sub": "e1f33a82-a3a0-4fd2-99e6-4a94723c3c53", "email": "xflores@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:55:48.320797+00', '2026-07-03 20:55:48.320846+00', '2026-07-03 20:55:48.320846+00', 'b4aa0031-4875-4822-a20c-342e78c08e02'),
	('f018a13c-779a-4435-92c2-53b133c2a72d', 'f018a13c-779a-4435-92c2-53b133c2a72d', '{"sub": "f018a13c-779a-4435-92c2-53b133c2a72d", "email": "msalinas@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:56:49.306038+00', '2026-07-03 20:56:49.306098+00', '2026-07-03 20:56:49.306098+00', 'f2d511ec-fdb4-4b77-900a-f7eeb0603584'),
	('059a17b9-b1cc-4e43-b125-8d9496ffa8c3', '059a17b9-b1cc-4e43-b125-8d9496ffa8c3', '{"sub": "059a17b9-b1cc-4e43-b125-8d9496ffa8c3", "email": "lgarcia@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:58:16.417781+00', '2026-07-03 20:58:16.417836+00', '2026-07-03 20:58:16.417836+00', '64ba909b-1990-4036-a419-10ac76cbbc4c'),
	('70b1eb3f-37e9-4501-983b-d172eaa3f1a5', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', '{"sub": "70b1eb3f-37e9-4501-983b-d172eaa3f1a5", "email": "vrodriguez@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:58:57.315984+00', '2026-07-03 20:58:57.316065+00', '2026-07-03 20:58:57.316065+00', '9e0af309-af92-4b81-851f-ad5f383cd6c9'),
	('eebcbe52-7dee-4bb6-85e1-391df30b99d0', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', '{"sub": "eebcbe52-7dee-4bb6-85e1-391df30b99d0", "email": "climon@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-03 20:59:37.128309+00', '2026-07-03 20:59:37.128372+00', '2026-07-03 20:59:37.128372+00', 'd49291f1-c5d2-41dd-a162-2cde84cf10df'),
	('5be7438a-1075-473d-a34a-dec6320e2ee0', '5be7438a-1075-473d-a34a-dec6320e2ee0', '{"sub": "5be7438a-1075-473d-a34a-dec6320e2ee0", "email": "ademirluna13@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-09 18:31:36.746003+00', '2026-07-09 18:31:36.746056+00', '2026-07-09 18:31:36.746056+00', '120b9b18-d5fc-4f10-b1ee-b23e3de89df7'),
	('a6f75547-6426-469a-9248-1489a23c199d', 'a6f75547-6426-469a-9248-1489a23c199d', '{"sub": "a6f75547-6426-469a-9248-1489a23c199d", "email": "karina.velasco@alsea.net", "email_verified": false, "phone_verified": false}', 'email', '2026-07-09 23:47:54.760805+00', '2026-07-09 23:47:54.760861+00', '2026-07-09 23:47:54.760861+00', 'a3561565-a09c-46db-b6f6-28918df78acd'),
	('3e49085a-6eaa-456c-9d53-6997d4d30491', '3e49085a-6eaa-456c-9d53-6997d4d30491', '{"sub": "3e49085a-6eaa-456c-9d53-6997d4d30491", "email": "daniela.juarez@alsea.net", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 00:03:29.385491+00', '2026-07-10 00:03:29.385545+00', '2026-07-10 00:03:29.385545+00', 'fd93c48e-b403-4403-bd5d-71626714afb9'),
	('54733af9-6db1-4683-b473-21723c877449', '54733af9-6db1-4683-b473-21723c877449', '{"sub": "54733af9-6db1-4683-b473-21723c877449", "email": "bbibiano@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 00:13:33.721518+00', '2026-07-10 00:13:33.721577+00', '2026-07-10 00:13:33.721577+00', 'a4e6f9b2-45f4-47b0-8541-3256a769edd9'),
	('e2b245b6-ac6b-4811-b24b-2b23dfb0a8be', 'e2b245b6-ac6b-4811-b24b-2b23dfb0a8be', '{"sub": "e2b245b6-ac6b-4811-b24b-2b23dfb0a8be", "email": "nicolas.mariscal@grupobimbo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 00:15:07.502216+00', '2026-07-10 00:15:07.502273+00', '2026-07-10 00:15:07.502273+00', 'a73a8679-7607-4892-9e99-32c2dacaba75'),
	('ae004f1d-7201-490d-825b-2e5e1babee6c', 'ae004f1d-7201-490d-825b-2e5e1babee6c', '{"sub": "ae004f1d-7201-490d-825b-2e5e1babee6c", "email": "maria.e.ramirez@grupobimbo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 00:16:14.969463+00', '2026-07-10 00:16:14.969561+00', '2026-07-10 00:16:14.969561+00', '8780ef15-d54d-435f-96e5-85feb8f5423a'),
	('6589ea5b-6c12-4aff-889c-16d125c2ec99', '6589ea5b-6c12-4aff-889c-16d125c2ec99', '{"sub": "6589ea5b-6c12-4aff-889c-16d125c2ec99", "email": "ivonne.castro@grupobimbo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 00:16:51.355852+00', '2026-07-10 00:16:51.355921+00', '2026-07-10 00:16:51.355921+00', '494f3e58-261c-4674-a81f-15df6a2a4901'),
	('bc8aee4c-21f6-47fb-9a65-f284c78aa7d5', 'bc8aee4c-21f6-47fb-9a65-f284c78aa7d5', '{"sub": "bc8aee4c-21f6-47fb-9a65-f284c78aa7d5", "email": "karem.zamora@grupobimbo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 00:18:46.628695+00', '2026-07-10 00:18:46.628749+00', '2026-07-10 00:18:46.628749+00', '4ecff17a-3543-4678-9de3-080fd41d9b4a'),
	('403debcb-7c38-4145-a9ca-3390e1f2b7cd', '403debcb-7c38-4145-a9ca-3390e1f2b7cd', '{"sub": "403debcb-7c38-4145-a9ca-3390e1f2b7cd", "email": "mariana.hernandez@cydsa.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 15:58:18.327399+00', '2026-07-10 15:58:18.327455+00', '2026-07-10 15:58:18.327455+00', 'e44c268e-9677-4ff2-a315-14df8d00157a'),
	('b62b0628-d46c-4285-a67c-cf67793786d2', 'b62b0628-d46c-4285-a67c-cf67793786d2', '{"sub": "b62b0628-d46c-4285-a67c-cf67793786d2", "email": "frank.zeller@cydsa.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 15:59:28.339012+00', '2026-07-10 15:59:28.339066+00', '2026-07-10 15:59:28.339066+00', 'c116275a-8673-4dd4-992f-9425d993b79c'),
	('af62bac6-af87-40f4-b02c-cb46fc5d2b52', 'af62bac6-af87-40f4-b02c-cb46fc5d2b52', '{"sub": "af62bac6-af87-40f4-b02c-cb46fc5d2b52", "email": "andres.vazquez@posadas.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:02:22.102756+00', '2026-07-10 16:02:22.102812+00', '2026-07-10 16:02:22.102812+00', '21cd7854-9516-4ec7-9976-9f07782192fb'),
	('ea62dff2-4c5b-43a7-8c10-1ad344e01b3c', 'ea62dff2-4c5b-43a7-8c10-1ad344e01b3c', '{"sub": "ea62dff2-4c5b-43a7-8c10-1ad344e01b3c", "email": "christian.salmeron@posadas.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:03:33.42145+00', '2026-07-10 16:03:33.421505+00', '2026-07-10 16:03:33.421505+00', 'c7ace13e-d1d0-4398-b1c7-b06dfda263fa'),
	('b4c42663-23b0-4426-a256-4deae497e473', 'b4c42663-23b0-4426-a256-4deae497e473', '{"sub": "b4c42663-23b0-4426-a256-4deae497e473", "email": "paola.gonzalezc@posadas.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:05:03.229768+00', '2026-07-10 16:05:03.229822+00', '2026-07-10 16:05:03.229822+00', '24769013-0aed-4e86-aeca-4744b3787924'),
	('cc5d4b45-dd70-48d5-9cbe-3eb98539ac15', 'cc5d4b45-dd70-48d5-9cbe-3eb98539ac15', '{"sub": "cc5d4b45-dd70-48d5-9cbe-3eb98539ac15", "email": "sofia.vazquez@nike.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:05:54.751582+00', '2026-07-10 16:05:54.751632+00', '2026-07-10 16:05:54.751632+00', 'b4aa0b58-66e4-4a02-a5f3-45f64ef29245'),
	('4d21cc67-d670-4142-9620-032f0dcbecf0', '4d21cc67-d670-4142-9620-032f0dcbecf0', '{"sub": "4d21cc67-d670-4142-9620-032f0dcbecf0", "email": "fmio@novonordisk.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:12:59.001288+00', '2026-07-10 16:12:59.001364+00', '2026-07-10 16:12:59.001364+00', '8ab5f755-ec8d-4ecc-9973-80572ae35251'),
	('befb88e9-fd13-4f79-9622-d6c6bdd52be7', 'befb88e9-fd13-4f79-9622-d6c6bdd52be7', '{"sub": "befb88e9-fd13-4f79-9622-d6c6bdd52be7", "email": "svgx@novonordisk.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:23:05.052972+00', '2026-07-10 16:23:05.053026+00', '2026-07-10 16:23:05.053026+00', '4435fa9e-8924-490d-b271-8e471725969f'),
	('e74cc442-94cd-4986-84ce-e7d96385b779', 'e74cc442-94cd-4986-84ce-e7d96385b779', '{"sub": "e74cc442-94cd-4986-84ce-e7d96385b779", "email": "ricado.palacio@enfragen.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:28:09.226187+00', '2026-07-10 16:28:09.226242+00', '2026-07-10 16:28:09.226242+00', '53084583-fcde-42e4-a3d8-866e9854dc63'),
	('0f0eca6a-1cc7-42d9-959b-2544cb036d36', '0f0eca6a-1cc7-42d9-959b-2544cb036d36', '{"sub": "0f0eca6a-1cc7-42d9-959b-2544cb036d36", "email": "juan.cruz@enfragen.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:28:54.147644+00', '2026-07-10 16:28:54.147749+00', '2026-07-10 16:28:54.147749+00', 'e3088ae3-7273-490f-8436-e407fde023c9'),
	('198c855a-2872-44f0-8153-f7c60c93f299', '198c855a-2872-44f0-8153-f7c60c93f299', '{"sub": "198c855a-2872-44f0-8153-f7c60c93f299", "email": "lucas.lagos@enfragen.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:29:39.229517+00', '2026-07-10 16:29:39.229572+00', '2026-07-10 16:29:39.229572+00', 'c12e706a-40a6-445f-b592-b805ac17e2e0'),
	('156d7e1c-904f-41d9-975e-58fbc686f677', '156d7e1c-904f-41d9-975e-58fbc686f677', '{"sub": "156d7e1c-904f-41d9-975e-58fbc686f677", "email": "arleth.garces@enfragen.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:30:55.271088+00', '2026-07-10 16:30:55.271143+00', '2026-07-10 16:30:55.271143+00', 'c5e35200-e137-42cc-a68e-ed8330d7e247'),
	('7f4722ee-e0f8-44d8-ba09-32b37055f8a2', '7f4722ee-e0f8-44d8-ba09-32b37055f8a2', '{"sub": "7f4722ee-e0f8-44d8-ba09-32b37055f8a2", "email": "natalia.jimenez@glenfarnecompanies.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:32:54.938194+00', '2026-07-10 16:32:54.938271+00', '2026-07-10 16:32:54.938271+00', '4dd76951-c23f-46b8-ae61-27043da57c73'),
	('45e18393-6642-47cc-b1dc-e0595089eb85', '45e18393-6642-47cc-b1dc-e0595089eb85', '{"sub": "45e18393-6642-47cc-b1dc-e0595089eb85", "email": "andres.bonilla@glenfarnecompanies.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:37:18.507694+00', '2026-07-10 16:37:18.507803+00', '2026-07-10 16:37:18.507803+00', 'a71bdbb3-90be-40e2-bffe-c8022ad4f89d'),
	('d946a934-56bd-4e23-b527-c27c927ec455', 'd946a934-56bd-4e23-b527-c27c927ec455', '{"sub": "d946a934-56bd-4e23-b527-c27c927ec455", "email": "natalia.gualteros@glenfarne.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-10 16:38:13.1747+00', '2026-07-10 16:38:13.174753+00', '2026-07-10 16:38:13.174753+00', '8f439635-c46e-41f3-8f84-c140c04e6dfb'),
	('000ed70a-a668-4379-82c6-a82e7d523543', '000ed70a-a668-4379-82c6-a82e7d523543', '{"sub": "000ed70a-a668-4379-82c6-a82e7d523543", "email": "jcornejo@tolkogroup.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-14 19:54:26.973326+00', '2026-07-14 19:54:26.973398+00', '2026-07-14 19:54:26.973398+00', 'a139d65d-2f49-4d10-9712-16ba27607537'),
	('3cfa4e52-9775-4fd9-bc3a-71acb29748a3', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', '{"sub": "3cfa4e52-9775-4fd9-bc3a-71acb29748a3", "email": "floresvaleria@la-bridgestone.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-14 23:29:18.496009+00', '2026-07-14 23:29:18.49607+00', '2026-07-14 23:29:18.49607+00', '5404040a-965f-4aea-a860-2cb09b595903'),
	('989c4298-86d3-416a-998f-2e82b3f9e553', '989c4298-86d3-416a-998f-2e82b3f9e553', '{"sub": "989c4298-86d3-416a-998f-2e82b3f9e553", "email": "direcciongeneral@amsofipo.mx", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:36:00.082968+00', '2026-07-16 16:36:00.083022+00', '2026-07-16 16:36:00.083022+00', '04b92aa5-74fc-403a-8939-a5780f511090'),
	('0be8c39b-72f0-4d3e-90ec-6713ed8f1325', '0be8c39b-72f0-4d3e-90ec-6713ed8f1325', '{"sub": "0be8c39b-72f0-4d3e-90ec-6713ed8f1325", "email": "aerazo@biopappel.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:36:33.225425+00', '2026-07-16 16:36:33.22547+00', '2026-07-16 16:36:33.22547+00', '0fad7ea9-a1b3-464a-9892-8f4a888079da'),
	('debcf540-88f6-4536-bd0f-5b30f2aa4141', 'debcf540-88f6-4536-bd0f-5b30f2aa4141', '{"sub": "debcf540-88f6-4536-bd0f-5b30f2aa4141", "email": "abejar@biopappel.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:36:57.236633+00', '2026-07-16 16:36:57.236686+00', '2026-07-16 16:36:57.236686+00', '646d0fae-d689-4b3d-b2ee-cb1fca639af7'),
	('d4fdb7c2-714a-40cc-bc4a-4299a20e0627', 'd4fdb7c2-714a-40cc-bc4a-4299a20e0627', '{"sub": "d4fdb7c2-714a-40cc-bc4a-4299a20e0627", "email": "arosellon@biopappel.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:37:23.555177+00', '2026-07-16 16:37:23.555226+00', '2026-07-16 16:37:23.555226+00', 'a87c96f7-b03d-4fa1-b4a2-32ee29d3857a'),
	('d32486d5-9d77-4934-9130-913398aa0ecc', 'd32486d5-9d77-4934-9130-913398aa0ecc', '{"sub": "d32486d5-9d77-4934-9130-913398aa0ecc", "email": "epadilla@biopappel.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:37:47.125611+00', '2026-07-16 16:37:47.125673+00', '2026-07-16 16:37:47.125673+00', 'deced4f7-17fb-4dd3-8b8b-73de1084561d'),
	('6996baad-8277-4c4b-b1c8-cbc4fac1005b', '6996baad-8277-4c4b-b1c8-cbc4fac1005b', '{"sub": "6996baad-8277-4c4b-b1c8-cbc4fac1005b", "email": "regina.velarde@crediclub.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:38:26.736387+00', '2026-07-16 16:38:26.73643+00', '2026-07-16 16:38:26.73643+00', 'eb73c7e6-9053-4eb3-88b0-b45cbd551ea3'),
	('c5711c22-a164-4d7f-8ad3-089635cb544c', 'c5711c22-a164-4d7f-8ad3-089635cb544c', '{"sub": "c5711c22-a164-4d7f-8ad3-089635cb544c", "email": "paulina.ramirez@crediclub.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:38:55.121427+00', '2026-07-16 16:38:55.121474+00', '2026-07-16 16:38:55.121474+00', '4e2e786e-7e30-4ca1-92d9-4134db0f9b9f'),
	('98dcd0ea-33e1-430d-b0ee-15e9211e0849', '98dcd0ea-33e1-430d-b0ee-15e9211e0849', '{"sub": "98dcd0ea-33e1-430d-b0ee-15e9211e0849", "email": "soniag@amib.com.mx", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:39:34.517328+00', '2026-07-16 16:39:34.517387+00', '2026-07-16 16:39:34.517387+00', '8ba9fc22-c789-4845-89df-7cb2fc3eacb9'),
	('e8a43ce5-b3fa-4b23-a8af-256872323fd5', 'e8a43ce5-b3fa-4b23-a8af-256872323fd5', '{"sub": "e8a43ce5-b3fa-4b23-a8af-256872323fd5", "email": "bcastillejos@amib.com.mx", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:39:53.815418+00', '2026-07-16 16:39:53.81547+00', '2026-07-16 16:39:53.81547+00', '71f4b1aa-3f0a-4bbc-8af0-5b32abd0cb5a'),
	('bef74040-1279-4b76-8cd8-497e37711cd9', 'bef74040-1279-4b76-8cd8-497e37711cd9', '{"sub": "bef74040-1279-4b76-8cd8-497e37711cd9", "email": "eva.barbosa@bayer.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:40:12.040378+00', '2026-07-16 16:40:12.040424+00', '2026-07-16 16:40:12.040424+00', '931e54bd-8eef-45e9-8bc0-ec5569550c18'),
	('7a36964d-aefa-49e3-938c-167fcec411a0', '7a36964d-aefa-49e3-938c-167fcec411a0', '{"sub": "7a36964d-aefa-49e3-938c-167fcec411a0", "email": "catalina.rodriguez1@bayer.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:40:32.655953+00', '2026-07-16 16:40:32.656001+00', '2026-07-16 16:40:32.656001+00', '4db64755-87ae-43c8-ae64-48657b439599'),
	('d35996b1-2855-424e-bb6e-08d14a02b323', 'd35996b1-2855-424e-bb6e-08d14a02b323', '{"sub": "d35996b1-2855-424e-bb6e-08d14a02b323", "email": "lorena.gallardo@bayer.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:40:51.123165+00', '2026-07-16 16:40:51.12321+00', '2026-07-16 16:40:51.12321+00', 'cafc058c-0c34-418f-a187-e21e70ae59eb'),
	('946ce820-aea2-495b-8856-9593826d2994', '946ce820-aea2-495b-8856-9593826d2994', '{"sub": "946ce820-aea2-495b-8856-9593826d2994", "email": "a.fares@ebc.edu.mx", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:49:57.574721+00', '2026-07-16 16:49:57.574791+00', '2026-07-16 16:49:57.574791+00', 'cfae068e-7e44-4622-9999-2ae2d977a213'),
	('75229c3d-19e2-47e0-b351-8e588d6f674d', '75229c3d-19e2-47e0-b351-8e588d6f674d', '{"sub": "75229c3d-19e2-47e0-b351-8e588d6f674d", "email": "p.zaragoza001@ebc.edu.mx", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:50:17.533728+00', '2026-07-16 16:50:17.533772+00', '2026-07-16 16:50:17.533772+00', '942e280f-243f-48d2-85a6-99aa1b0e3262'),
	('404e4037-6517-4a5e-b6e5-0f91dccf4aae', '404e4037-6517-4a5e-b6e5-0f91dccf4aae', '{"sub": "404e4037-6517-4a5e-b6e5-0f91dccf4aae", "email": "g.rodriguez077@ebc.edu.mx", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 16:50:36.230133+00', '2026-07-16 16:50:36.230184+00', '2026-07-16 16:50:36.230184+00', 'dac4a18e-1d96-4349-adb5-98cf7a42b6f6'),
	('e19b0182-0a1e-4637-b85d-ba337ba2d133', 'e19b0182-0a1e-4637-b85d-ba337ba2d133', '{"sub": "e19b0182-0a1e-4637-b85d-ba337ba2d133", "email": "karla.heras@grupobimbo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 22:38:29.607791+00', '2026-07-16 22:38:29.607849+00', '2026-07-16 22:38:29.607849+00', 'e32344ce-701b-4b63-b7ea-8cdf04d46820'),
	('8caa4432-c8a5-44fa-bdad-e38613f029e1', '8caa4432-c8a5-44fa-bdad-e38613f029e1', '{"sub": "8caa4432-c8a5-44fa-bdad-e38613f029e1", "email": "sergio.reyna@grupobimbo.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 22:42:47.775209+00', '2026-07-16 22:42:47.775276+00', '2026-07-16 22:42:47.775276+00', '90ca5b59-6dfd-4fc3-b96f-6a424d8a4d5f');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('aa96f9c3-ea7b-44e6-ab1a-4a6f5db828d4', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', '2026-07-17 18:25:11.519617+00', '2026-07-17 20:30:57.671498+00', NULL, 'aal1', NULL, '2026-07-17 20:30:57.671388', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('b43a5558-9cec-42cc-add7-06946ae6a0bf', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-16 20:24:16.196129+00', '2026-07-20 15:31:52.218732+00', NULL, 'aal1', NULL, '2026-07-20 15:31:52.217378', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('d9d8773f-a74d-4f9c-9c46-4b22d9a21aeb', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', '2026-05-28 19:32:58.739647+00', '2026-05-29 14:41:22.153381+00', NULL, 'aal1', NULL, '2026-05-29 14:41:22.153257', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '187.189.215.149', NULL, NULL, NULL, NULL, NULL),
	('095f2732-3a14-4a1a-9fb6-49a1bd4e8ae0', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', '2026-07-15 18:51:46.375977+00', '2026-07-16 01:30:35.659477+00', NULL, 'aal1', NULL, '2026-07-16 01:30:35.65937', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('daf0b24f-07da-4d49-ba37-a480b5c6dfe8', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', '2026-07-14 19:58:33.660383+00', '2026-07-16 15:31:52.557904+00', NULL, 'aal1', NULL, '2026-07-16 15:31:52.557794', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('86f8d9dc-a06c-4c0f-830a-b1e9a3979d81', '63d5d908-34a0-4daa-94f4-91cb329f7d17', '2026-07-17 01:27:06.229061+00', '2026-07-17 15:23:56.970662+00', NULL, 'aal1', NULL, '2026-07-17 15:23:56.97054', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('aa97494e-a270-4567-9646-872c79226fc9', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 17:22:40.847958+00', '2026-07-17 22:07:46.274064+00', NULL, 'aal1', NULL, '2026-07-17 22:07:46.273929', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('f5797a7a-db6a-4f39-9445-d38c518d4494', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-15 15:12:25.399531+00', '2026-07-16 20:24:14.481816+00', NULL, 'aal1', NULL, '2026-07-16 20:24:14.481701', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('03a772f2-0169-4361-8dd1-a07b13ab2a46', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-15 18:06:55.456469+00', '2026-07-16 18:04:30.705213+00', NULL, 'aal1', NULL, '2026-07-16 18:04:30.70506', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('601db310-1434-4629-9a40-42f24034b799', '806439f5-c268-4ef1-90e0-9c6b20afc521', '2026-07-14 23:36:24.681567+00', '2026-07-20 15:48:25.988894+00', NULL, 'aal1', NULL, '2026-07-20 15:48:25.988784', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('b38715f7-8686-4648-a30a-872fa276646d', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', '2026-07-14 22:58:35.34414+00', '2026-07-14 22:58:35.34414+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('bec1b2b0-d2b3-41d9-ad73-aef1de890f07', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', '2026-07-16 15:32:18.466064+00', '2026-07-17 17:01:32.952146+00', NULL, 'aal1', NULL, '2026-07-17 17:01:32.951953', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('d8d8ff46-6aec-466a-af89-7a982e164337', '473016e7-f5e4-451e-a889-8d19a11484f2', '2026-07-14 23:20:24.128651+00', '2026-07-15 00:39:20.072853+00', NULL, 'aal1', NULL, '2026-07-15 00:39:20.072742', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('e1917ea2-3bbe-4330-b575-0b6abeb46d7a', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-14 23:22:09.089204+00', '2026-07-15 15:12:02.081831+00', NULL, 'aal1', NULL, '2026-07-15 15:12:02.081694', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('191f5362-6560-431b-84cc-16a171e0f679', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', '2026-07-14 20:15:49.640786+00', '2026-07-16 00:07:47.950654+00', NULL, 'aal1', NULL, '2026-07-16 00:07:47.950499', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('e1d4128f-c060-4471-b6db-502cc94e5882', '059a17b9-b1cc-4e43-b125-8d9496ffa8c3', '2026-07-15 00:02:14.566969+00', '2026-07-15 01:08:27.420273+00', NULL, 'aal1', NULL, '2026-07-15 01:08:27.42017', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('aaf41e6b-6c9e-4d8b-9f47-765ac81154c2', 'f018a13c-779a-4435-92c2-53b133c2a72d', '2026-07-15 17:47:32.364193+00', '2026-07-15 18:49:57.048999+00', NULL, 'aal1', NULL, '2026-07-15 18:49:57.048911', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('9243c5cf-2e17-4465-8233-155233e525b4', '4b4cc46b-65be-4faa-9d06-81e4d6893343', '2026-07-15 16:10:06.956915+00', '2026-07-20 15:56:38.456076+00', NULL, 'aal1', NULL, '2026-07-20 15:56:38.455976', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('b46e3b21-af8d-4443-8aa1-e23af76f47fd', '93bb792e-b541-48da-9901-d7e1878fdfb5', '2026-07-14 19:52:21.165803+00', '2026-07-14 23:12:41.31948+00', NULL, 'aal1', NULL, '2026-07-14 23:12:41.31939', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('cb358ace-187f-4faf-8a04-982e10eea901', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', '2026-07-13 16:36:05.432979+00', '2026-07-13 16:36:05.432979+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('33c7d930-61c0-4926-be41-ef8c80fb4a75', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-15 17:45:05.20689+00', '2026-07-17 20:21:51.867535+00', NULL, 'aal1', NULL, '2026-07-17 20:21:51.867424', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('94b7b29c-4468-4912-97b4-032ed6d78d83', '4601c73d-a873-4b9f-901b-0998d5536c9c', '2026-07-15 15:18:17.838845+00', '2026-07-15 22:52:07.234341+00', NULL, 'aal1', NULL, '2026-07-15 22:52:07.234217', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('dcd603d1-e9c8-4508-bcd1-c218a4652b4d', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', '2026-07-14 20:36:18.936547+00', '2026-07-17 22:04:17.487816+00', NULL, 'aal1', NULL, '2026-07-17 22:04:17.487679', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('fb9a4b3f-c26e-4ae4-83fe-5076df090d85', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-17 20:02:10.377248+00', '2026-07-20 15:25:14.632548+00', NULL, 'aal1', NULL, '2026-07-20 15:25:14.632447', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('6380e063-e266-4eef-badb-30b3a86c78c6', '000ed70a-a668-4379-82c6-a82e7d523543', '2026-07-14 20:04:40.507601+00', '2026-07-20 16:36:30.572069+00', NULL, 'aal1', NULL, '2026-07-20 16:36:30.571964', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('7233aa5f-6707-4232-906f-06276df01a08', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', '2026-07-14 23:03:45.967842+00', '2026-07-15 01:31:51.484777+00', NULL, 'aal1', NULL, '2026-07-15 01:31:51.48467', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('01f835a7-3831-4742-992f-cf6674793d9a', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-14 19:50:21.204938+00', '2026-07-15 22:55:34.02697+00', NULL, 'aal1', NULL, '2026-07-15 22:55:34.026855', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('beee164f-ba85-4512-b1df-1971368dc31d', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-16 18:04:32.87694+00', '2026-07-17 02:15:56.41783+00', NULL, 'aal1', NULL, '2026-07-17 02:15:56.417722', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('eb479d45-e0e5-4443-a012-cb0dce0876fb', '56ea6af7-d061-4ea7-8793-72641fba5d91', '2026-07-17 15:41:27.44204+00', '2026-07-17 15:41:27.44204+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('acca3d58-de24-42cb-b800-53d630cbee6a', '4601c73d-a873-4b9f-901b-0998d5536c9c', '2026-07-15 22:52:18.005707+00', '2026-07-16 16:26:11.295036+00', NULL, 'aal1', NULL, '2026-07-16 16:26:11.291568', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('86dcce47-18a2-4c3d-aff2-5a6663b858a3', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-17 19:05:08.081265+00', '2026-07-17 20:03:28.685211+00', NULL, 'aal1', NULL, '2026-07-17 20:03:28.685064', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL),
	('5cdf3a66-3c74-4f91-8e97-138d57988c8d', '6901712f-b020-4eec-83eb-13d1eff277c0', '2026-07-20 15:56:49.195489+00', '2026-07-20 15:56:49.195489+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '187.189.173.8', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('b43a5558-9cec-42cc-add7-06946ae6a0bf', '2026-07-16 20:24:16.210425+00', '2026-07-16 20:24:16.210425+00', 'password', '49609216-adc7-44a1-9eca-6482583b3fee'),
	('01f835a7-3831-4742-992f-cf6674793d9a', '2026-07-14 19:50:21.225785+00', '2026-07-14 19:50:21.225785+00', 'password', '11189009-62a1-4fba-b364-105fdfc76565'),
	('b46e3b21-af8d-4443-8aa1-e23af76f47fd', '2026-07-14 19:52:21.181078+00', '2026-07-14 19:52:21.181078+00', 'password', '67651264-c5d6-4e4e-9f47-853c5ba58bc3'),
	('daf0b24f-07da-4d49-ba37-a480b5c6dfe8', '2026-07-14 19:58:33.708062+00', '2026-07-14 19:58:33.708062+00', 'password', 'b7f16cb3-0fef-474b-bdaf-65856fc7caf3'),
	('6380e063-e266-4eef-badb-30b3a86c78c6', '2026-07-14 20:04:40.526465+00', '2026-07-14 20:04:40.526465+00', 'password', '48ebe67f-5a72-4425-837a-bf3bbe2333c8'),
	('191f5362-6560-431b-84cc-16a171e0f679', '2026-07-14 20:15:49.663592+00', '2026-07-14 20:15:49.663592+00', 'password', 'd041d804-611f-43c9-a5af-5e93c928d395'),
	('dcd603d1-e9c8-4508-bcd1-c218a4652b4d', '2026-07-14 20:36:18.959839+00', '2026-07-14 20:36:18.959839+00', 'password', '08c8b75c-00bc-4cbe-ae1f-99bd7bbffb88'),
	('b38715f7-8686-4648-a30a-872fa276646d', '2026-07-14 22:58:35.346967+00', '2026-07-14 22:58:35.346967+00', 'password', 'f8eafdfa-20f5-4d63-abb7-64288cadfc0f'),
	('7233aa5f-6707-4232-906f-06276df01a08', '2026-07-14 23:03:46.015283+00', '2026-07-14 23:03:46.015283+00', 'password', 'b077a3b8-2573-4c0d-9c4f-97739aa9da3c'),
	('86f8d9dc-a06c-4c0f-830a-b1e9a3979d81', '2026-07-17 01:27:06.244119+00', '2026-07-17 01:27:06.244119+00', 'password', '6d71fe07-fb40-42be-bd54-55f7f7962b0e'),
	('d8d8ff46-6aec-466a-af89-7a982e164337', '2026-07-14 23:20:24.151375+00', '2026-07-14 23:20:24.151375+00', 'password', '1213b5e0-3662-468c-8fad-1a94eed1dc20'),
	('eb479d45-e0e5-4443-a012-cb0dce0876fb', '2026-07-17 15:41:27.476703+00', '2026-07-17 15:41:27.476703+00', 'password', 'fefc1bd4-6b8e-4efe-900e-29ed84af30ad'),
	('e1917ea2-3bbe-4330-b575-0b6abeb46d7a', '2026-07-14 23:22:09.103945+00', '2026-07-14 23:22:09.103945+00', 'password', '4a802c7d-8edb-44a7-b023-685e340fdb90'),
	('601db310-1434-4629-9a40-42f24034b799', '2026-07-14 23:36:24.729376+00', '2026-07-14 23:36:24.729376+00', 'password', '579ec31a-414a-4036-bbc9-34389b8bbd1f'),
	('d9d8773f-a74d-4f9c-9c46-4b22d9a21aeb', '2026-05-28 19:32:58.779725+00', '2026-05-28 19:32:58.779725+00', 'password', '0bf124e6-528d-439d-b124-018bd26e40a0'),
	('e1d4128f-c060-4471-b6db-502cc94e5882', '2026-07-15 00:02:14.585763+00', '2026-07-15 00:02:14.585763+00', 'password', 'f6aac5a3-1098-4cd9-a613-973097bb4324'),
	('f5797a7a-db6a-4f39-9445-d38c518d4494', '2026-07-15 15:12:25.428233+00', '2026-07-15 15:12:25.428233+00', 'password', '403b1567-f6fe-44e5-ba2a-58696d5fb4c8'),
	('94b7b29c-4468-4912-97b4-032ed6d78d83', '2026-07-15 15:18:17.861073+00', '2026-07-15 15:18:17.861073+00', 'password', 'ee092555-29d7-4b34-aebd-200560eceaa5'),
	('cb358ace-187f-4faf-8a04-982e10eea901', '2026-07-13 16:36:05.455364+00', '2026-07-13 16:36:05.455364+00', 'password', '230736ec-30a8-43a8-8635-18a02b2501ae'),
	('9243c5cf-2e17-4465-8233-155233e525b4', '2026-07-15 16:10:06.971782+00', '2026-07-15 16:10:06.971782+00', 'password', '9fa97dde-b1ca-4571-8afb-d653b4fdf217'),
	('aa96f9c3-ea7b-44e6-ab1a-4a6f5db828d4', '2026-07-17 18:25:11.566179+00', '2026-07-17 18:25:11.566179+00', 'password', '00a071fa-8580-439e-871a-3da7fe6fa82f'),
	('86dcce47-18a2-4c3d-aff2-5a6663b858a3', '2026-07-17 19:05:08.148634+00', '2026-07-17 19:05:08.148634+00', 'password', '3b52799b-9999-464b-bc7b-e4c69fd02cf1'),
	('fb9a4b3f-c26e-4ae4-83fe-5076df090d85', '2026-07-17 20:02:10.446867+00', '2026-07-17 20:02:10.446867+00', 'password', 'ef67b324-2731-41e1-ad6c-00e6a3e74aa9'),
	('5cdf3a66-3c74-4f91-8e97-138d57988c8d', '2026-07-20 15:56:49.219646+00', '2026-07-20 15:56:49.219646+00', 'password', '3b0c5b43-21d6-4657-ac2e-f00904e89536'),
	('33c7d930-61c0-4926-be41-ef8c80fb4a75', '2026-07-15 17:45:05.231871+00', '2026-07-15 17:45:05.231871+00', 'password', '862c97c6-4a0e-4151-91b6-953f346003ae'),
	('aaf41e6b-6c9e-4d8b-9f47-765ac81154c2', '2026-07-15 17:47:32.385896+00', '2026-07-15 17:47:32.385896+00', 'password', '327265ce-628e-4a10-9b62-0ec9ffc0c061'),
	('03a772f2-0169-4361-8dd1-a07b13ab2a46', '2026-07-15 18:06:55.507519+00', '2026-07-15 18:06:55.507519+00', 'password', '0442d141-2b0f-474a-918c-8a930180e6bc'),
	('095f2732-3a14-4a1a-9fb6-49a1bd4e8ae0', '2026-07-15 18:51:46.436668+00', '2026-07-15 18:51:46.436668+00', 'password', 'bb38c951-a53b-47b6-afdd-c9863cf25bf1'),
	('acca3d58-de24-42cb-b800-53d630cbee6a', '2026-07-15 22:52:18.01231+00', '2026-07-15 22:52:18.01231+00', 'password', '73129a1b-189f-4925-945c-03af3f199363'),
	('bec1b2b0-d2b3-41d9-ad73-aef1de890f07', '2026-07-16 15:32:18.495125+00', '2026-07-16 15:32:18.495125+00', 'password', 'f3c61bfa-0443-444e-831b-d57a9f0563b0'),
	('aa97494e-a270-4567-9646-872c79226fc9', '2026-07-16 17:22:40.882267+00', '2026-07-16 17:22:40.882267+00', 'password', 'd0fd4a7f-c83f-4a52-8fc2-55a7d6865ef0'),
	('beee164f-ba85-4512-b1df-1971368dc31d', '2026-07-16 18:04:32.89903+00', '2026-07-16 18:04:32.89903+00', 'password', '6b056944-03b4-4f83-9e34-81c21dd4b932');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 865, 'vmimo4623xua', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', false, '2026-07-17 20:21:51.852979+00', '2026-07-17 20:21:51.852979+00', 'bjh25oa2alpi', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 873, 'olin3gsnqtik', '17d5d747-fdd1-4d4f-88cc-aa2909995088', true, '2026-07-17 23:02:51.489849+00', '2026-07-20 15:25:14.582243+00', 'wxzttyv6i4sy', 'fb9a4b3f-c26e-4ae4-83fe-5076df090d85'),
	('00000000-0000-0000-0000-000000000000', 598, '4gbf4pwwfp55', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, '2026-07-14 22:55:09.900077+00', '2026-07-15 21:53:12.593457+00', 'digrmaisb6kd', '01f835a7-3831-4742-992f-cf6674793d9a'),
	('00000000-0000-0000-0000-000000000000', 645, '2dok62uzoh5r', '4601c73d-a873-4b9f-901b-0998d5536c9c', true, '2026-07-15 15:18:17.856014+00', '2026-07-15 22:52:07.227488+00', NULL, '94b7b29c-4468-4912-97b4-032ed6d78d83'),
	('00000000-0000-0000-0000-000000000000', 678, 'ptjmyx7zezet', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-15 18:33:10.330254+00', '2026-07-15 23:06:26.996898+00', 'vhdoodaajnue', 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 877, '3kyvhm4uzbfa', '806439f5-c268-4ef1-90e0-9c6b20afc521', false, '2026-07-20 15:48:25.961138+00', '2026-07-20 15:48:25.961138+00', 'u2zmmne2ngmt', '601db310-1434-4629-9a40-42f24034b799'),
	('00000000-0000-0000-0000-000000000000', 649, '2ofmzidkv6ga', '806439f5-c268-4ef1-90e0-9c6b20afc521', true, '2026-07-15 15:54:39.589518+00', '2026-07-15 16:56:07.145005+00', '7wavszcluqar', '601db310-1434-4629-9a40-42f24034b799'),
	('00000000-0000-0000-0000-000000000000', 697, 'lmrcdbn4f2yd', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-15 19:48:40.044762+00', '2026-07-15 23:29:57.051288+00', 'vkbxsrcc2pke', '03a772f2-0169-4361-8dd1-a07b13ab2a46'),
	('00000000-0000-0000-0000-000000000000', 768, '4s3r7x5naafs', '4601c73d-a873-4b9f-901b-0998d5536c9c', false, '2026-07-16 16:26:11.275703+00', '2026-07-16 16:26:11.275703+00', 'pkvivfxnppc3', 'acca3d58-de24-42cb-b800-53d630cbee6a'),
	('00000000-0000-0000-0000-000000000000', 627, '25igrcgrimeh', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-15 00:43:20.891598+00', '2026-07-15 17:18:42.245673+00', 'ijxa34atov5r', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 762, 'jfi6f2c2ry6r', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-16 15:32:18.482465+00', '2026-07-16 16:48:16.114157+00', NULL, 'bec1b2b0-d2b3-41d9-ad73-aef1de890f07'),
	('00000000-0000-0000-0000-000000000000', 208, 'r5oxftfafwrp', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', true, '2026-05-28 19:32:58.764905+00', '2026-05-29 14:41:22.102224+00', NULL, 'd9d8773f-a74d-4f9c-9c46-4b22d9a21aeb'),
	('00000000-0000-0000-0000-000000000000', 216, 'yylxyojymoyz', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', false, '2026-05-29 14:41:22.127946+00', '2026-05-29 14:41:22.127946+00', 'r5oxftfafwrp', 'd9d8773f-a74d-4f9c-9c46-4b22d9a21aeb'),
	('00000000-0000-0000-0000-000000000000', 575, 'pxsmlfpu5zyb', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, '2026-07-14 19:50:21.221083+00', '2026-07-14 21:16:00.554621+00', NULL, '01f835a7-3831-4742-992f-cf6674793d9a'),
	('00000000-0000-0000-0000-000000000000', 775, '7e2nn6hby4hb', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-16 17:13:36.798208+00', '2026-07-16 18:21:56.424715+00', 'fdnms66fdsn7', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 665, '5i2inwyrw3xb', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', true, '2026-07-15 17:02:23.934349+00', '2026-07-15 18:24:41.701947+00', 'olwitcgcvm2z', 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 589, 'digrmaisb6kd', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, '2026-07-14 21:16:00.559847+00', '2026-07-14 22:55:09.893614+00', 'pxsmlfpu5zyb', '01f835a7-3831-4742-992f-cf6674793d9a'),
	('00000000-0000-0000-0000-000000000000', 780, 'a3kh3ltrliy7', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-16 17:59:01.843306+00', '2026-07-16 19:17:12.698546+00', 'k2lumulk6sgl', 'bec1b2b0-d2b3-41d9-ad73-aef1de890f07'),
	('00000000-0000-0000-0000-000000000000', 674, 'ejvasv6i3zej', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-15 17:45:05.222684+00', '2026-07-15 18:44:00.2615+00', NULL, '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 783, 'zwyt5smmr5t4', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-16 18:21:56.435317+00', '2026-07-16 19:20:10.220619+00', '7e2nn6hby4hb', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 784, '7gxaagvxllnd', '2072a09e-3804-447f-a7f5-efacc0589e83', true, '2026-07-16 18:22:48.746701+00', '2026-07-16 19:21:58.273643+00', 'r66jfao43n6z', 'aa97494e-a270-4567-9646-872c79226fc9'),
	('00000000-0000-0000-0000-000000000000', 683, 'qqr4rno2mivi', 'f018a13c-779a-4435-92c2-53b133c2a72d', false, '2026-07-15 18:49:57.046107+00', '2026-07-15 18:49:57.046107+00', 'raftfftbcgiv', 'aaf41e6b-6c9e-4d8b-9f47-765ac81154c2'),
	('00000000-0000-0000-0000-000000000000', 786, 'qktqfu4qbggk', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-16 19:20:10.226742+00', '2026-07-16 20:25:39.489246+00', 'zwyt5smmr5t4', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 643, 'pubnr5p4m3hb', '897e2dd9-2646-4d9e-a20d-f40da228e85e', true, '2026-07-15 15:12:25.414685+00', '2026-07-15 18:56:14.431646+00', NULL, 'f5797a7a-db6a-4f39-9445-d38c518d4494'),
	('00000000-0000-0000-0000-000000000000', 788, 'hk5rlatmf4tr', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-16 19:37:15.199579+00', '2026-07-16 20:47:06.481814+00', 'cmsigaj2372q', 'beee164f-ba85-4512-b1df-1971368dc31d'),
	('00000000-0000-0000-0000-000000000000', 578, 'uhtdmjywyobe', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-14 19:58:33.687398+00', '2026-07-14 23:31:10.448287+00', NULL, 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 595, 'ojugnc3g5kpm', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-14 22:44:21.706278+00', '2026-07-14 23:44:51.258811+00', '4ajgzufxuprq', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 613, '5okorxtwl3v2', '806439f5-c268-4ef1-90e0-9c6b20afc521', true, '2026-07-14 23:36:24.709376+00', '2026-07-15 00:35:41.963123+00', NULL, '601db310-1434-4629-9a40-42f24034b799'),
	('00000000-0000-0000-0000-000000000000', 609, 'qwo6t54h6k4k', '473016e7-f5e4-451e-a889-8d19a11484f2', true, '2026-07-14 23:20:24.145296+00', '2026-07-15 00:39:20.050188+00', NULL, 'd8d8ff46-6aec-466a-af89-7a982e164337'),
	('00000000-0000-0000-0000-000000000000', 676, 'vkbxsrcc2pke', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-15 18:06:55.485853+00', '2026-07-15 19:48:40.035784+00', NULL, '03a772f2-0169-4361-8dd1-a07b13ab2a46'),
	('00000000-0000-0000-0000-000000000000', 636, 'rrjhlxioaom3', '059a17b9-b1cc-4e43-b125-8d9496ffa8c3', false, '2026-07-15 01:08:27.404097+00', '2026-07-15 01:08:27.404097+00', 'jbytsujgjuix', 'e1d4128f-c060-4471-b6db-502cc94e5882'),
	('00000000-0000-0000-0000-000000000000', 605, 'tf2xlp7osdph', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', true, '2026-07-14 23:03:45.997579+00', '2026-07-15 01:31:51.457371+00', NULL, '7233aa5f-6707-4232-906f-06276df01a08'),
	('00000000-0000-0000-0000-000000000000', 640, 'n5d3pvu2zsfb', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', false, '2026-07-15 01:31:51.467727+00', '2026-07-15 01:31:51.467727+00', 'tf2xlp7osdph', '7233aa5f-6707-4232-906f-06276df01a08'),
	('00000000-0000-0000-0000-000000000000', 586, 'd7gm463fubub', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', true, '2026-07-14 20:36:18.952244+00', '2026-07-15 02:24:21.479346+00', NULL, 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 611, '7fijdl6cpdqw', '897e2dd9-2646-4d9e-a20d-f40da228e85e', true, '2026-07-14 23:22:09.099967+00', '2026-07-15 15:12:02.034528+00', NULL, 'e1917ea2-3bbe-4330-b575-0b6abeb46d7a'),
	('00000000-0000-0000-0000-000000000000', 642, 'dd7fnyv6uweh', '897e2dd9-2646-4d9e-a20d-f40da228e85e', false, '2026-07-15 15:12:02.054456+00', '2026-07-15 15:12:02.054456+00', '7fijdl6cpdqw', 'e1917ea2-3bbe-4330-b575-0b6abeb46d7a'),
	('00000000-0000-0000-0000-000000000000', 624, '7wavszcluqar', '806439f5-c268-4ef1-90e0-9c6b20afc521', true, '2026-07-15 00:35:41.971301+00', '2026-07-15 15:54:39.570443+00', '5okorxtwl3v2', '601db310-1434-4629-9a40-42f24034b799'),
	('00000000-0000-0000-0000-000000000000', 692, '7ty7akcb7ssw', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-15 19:02:17.504935+00', '2026-07-15 20:17:34.768457+00', '644dd24k3flx', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 860, 'hwtev2bzkctz', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', true, '2026-07-17 19:26:07.646274+00', '2026-07-17 20:30:57.645161+00', 't7frk2stwjbj', 'aa96f9c3-ea7b-44e6-ab1a-4a6f5db828d4'),
	('00000000-0000-0000-0000-000000000000', 542, 'af67chtyxjjq', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', false, '2026-07-13 16:36:05.44644+00', '2026-07-13 16:36:05.44644+00', NULL, 'cb358ace-187f-4faf-8a04-982e10eea901'),
	('00000000-0000-0000-0000-000000000000', 866, 'elsgjf2lk2pj', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', false, '2026-07-17 20:30:57.652514+00', '2026-07-17 20:30:57.652514+00', 'hwtev2bzkctz', 'aa96f9c3-ea7b-44e6-ab1a-4a6f5db828d4'),
	('00000000-0000-0000-0000-000000000000', 834, '3ztgquaankcs', '855ecf57-5a53-4e36-91db-d4e607a8bb42', false, '2026-07-17 02:15:56.393294+00', '2026-07-17 02:15:56.393294+00', 'ngmbxvo4yldu', 'beee164f-ba85-4512-b1df-1971368dc31d'),
	('00000000-0000-0000-0000-000000000000', 864, 'ctyjgpwkq5eu', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', true, '2026-07-17 20:19:20.051768+00', '2026-07-17 22:04:17.459225+00', 'vedihew2espn', 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 870, 'e23tssk7rz3v', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', false, '2026-07-17 22:04:17.469966+00', '2026-07-17 22:04:17.469966+00', 'ctyjgpwkq5eu', 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 715, 'g75jdvtdigjn', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, '2026-07-15 21:53:12.613059+00', '2026-07-15 22:55:34.001757+00', '4gbf4pwwfp55', '01f835a7-3831-4742-992f-cf6674793d9a'),
	('00000000-0000-0000-0000-000000000000', 826, '7jhprv5qlddb', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-17 00:19:36.0855+00', '2026-07-20 15:56:38.442034+00', 'edzmhkdmu3ww', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 874, '6azgmcktxjlx', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-17 23:04:11.180165+00', '2026-07-20 16:36:30.528256+00', 'muyxxwcnxcqq', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 584, 'm6ocwopfyt6m', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-14 20:15:49.658378+00', '2026-07-14 21:27:01.994609+00', NULL, '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 684, '4gumtxx3xyta', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', true, '2026-07-15 18:51:46.408372+00', '2026-07-15 22:57:04.823174+00', NULL, '095f2732-3a14-4a1a-9fb6-49a1bd4e8ae0'),
	('00000000-0000-0000-0000-000000000000', 686, '3zrf4qawwsss', '806439f5-c268-4ef1-90e0-9c6b20afc521', true, '2026-07-15 18:55:46.162251+00', '2026-07-15 23:00:56.606651+00', 'd33bvnjpy4vv', '601db310-1434-4629-9a40-42f24034b799'),
	('00000000-0000-0000-0000-000000000000', 590, '4ajgzufxuprq', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-14 21:27:02.000569+00', '2026-07-14 22:44:21.705891+00', 'm6ocwopfyt6m', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 650, 'olwitcgcvm2z', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', true, '2026-07-15 15:55:47.770837+00', '2026-07-15 17:02:23.925705+00', 'n2u6vuftxl2w', 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 581, 'xu6zewdtnqub', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-14 20:04:40.51554+00', '2026-07-14 22:52:06.369383+00', NULL, '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 702, 'gew5jooyqnap', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-15 20:10:49.486434+00', '2026-07-15 23:19:40.339226+00', '4uooojcv4n2t', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 602, '6e5w6x5dlaqx', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', false, '2026-07-14 22:58:35.34551+00', '2026-07-14 22:58:35.34551+00', NULL, 'b38715f7-8686-4648-a30a-872fa276646d'),
	('00000000-0000-0000-0000-000000000000', 704, 'haqic6vqfz2c', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-15 20:17:34.784433+00', '2026-07-16 00:07:47.924602+00', '7ty7akcb7ssw', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 766, 'jix3brfwnen3', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-16 16:17:45.429484+00', '2026-07-16 17:37:30.211382+00', 'pibij6hb765j', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 679, 'ckep2ctqkge6', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-15 18:43:07.949716+00', '2026-07-16 00:44:33.55048+00', 'tpbwdku2ajur', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 772, 'k2lumulk6sgl', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-16 16:48:16.126482+00', '2026-07-16 17:59:01.830667+00', 'jfi6f2c2ry6r', 'bec1b2b0-d2b3-41d9-ad73-aef1de890f07'),
	('00000000-0000-0000-0000-000000000000', 577, 'rdbo2rjpvtho', '93bb792e-b541-48da-9901-d7e1878fdfb5', true, '2026-07-14 19:52:21.177393+00', '2026-07-14 23:12:41.315648+00', NULL, 'b46e3b21-af8d-4443-8aa1-e23af76f47fd'),
	('00000000-0000-0000-0000-000000000000', 608, 'qdsgzlmuhs5i', '93bb792e-b541-48da-9901-d7e1878fdfb5', false, '2026-07-14 23:12:41.316702+00', '2026-07-14 23:12:41.316702+00', 'rdbo2rjpvtho', 'b46e3b21-af8d-4443-8aa1-e23af76f47fd'),
	('00000000-0000-0000-0000-000000000000', 644, 'vhdoodaajnue', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-15 15:15:26.169457+00', '2026-07-15 18:33:10.320299+00', '4vvqqllbviza', 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 781, 'o4tii7ot4rdr', '855ecf57-5a53-4e36-91db-d4e607a8bb42', false, '2026-07-16 18:04:30.684447+00', '2026-07-16 18:04:30.684447+00', 'ti2zipzwrz2j', '03a772f2-0169-4361-8dd1-a07b13ab2a46'),
	('00000000-0000-0000-0000-000000000000', 776, 'r66jfao43n6z', '2072a09e-3804-447f-a7f5-efacc0589e83', true, '2026-07-16 17:22:40.863648+00', '2026-07-16 18:22:48.740144+00', NULL, 'aa97494e-a270-4567-9646-872c79226fc9'),
	('00000000-0000-0000-0000-000000000000', 653, 'tpbwdku2ajur', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-15 16:10:06.968014+00', '2026-07-15 18:43:07.944474+00', NULL, '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 847, 'zf4zq4mymopz', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', false, '2026-07-17 17:01:32.938578+00', '2026-07-17 17:01:32.938578+00', 'pnlpxgdn75ya', 'bec1b2b0-d2b3-41d9-ad73-aef1de890f07'),
	('00000000-0000-0000-0000-000000000000', 703, 'qu56fqw4nizs', '897e2dd9-2646-4d9e-a20d-f40da228e85e', true, '2026-07-15 20:12:47.180298+00', '2026-07-16 20:24:14.457176+00', 'qluzew2snehj', 'f5797a7a-db6a-4f39-9445-d38c518d4494'),
	('00000000-0000-0000-0000-000000000000', 675, 'raftfftbcgiv', 'f018a13c-779a-4435-92c2-53b133c2a72d', true, '2026-07-15 17:47:32.375936+00', '2026-07-15 18:49:57.043648+00', NULL, 'aaf41e6b-6c9e-4d8b-9f47-765ac81154c2'),
	('00000000-0000-0000-0000-000000000000', 625, 'iwzamfphkiwo', '473016e7-f5e4-451e-a889-8d19a11484f2', false, '2026-07-15 00:39:20.057292+00', '2026-07-15 00:39:20.057292+00', 'qwo6t54h6k4k', 'd8d8ff46-6aec-466a-af89-7a982e164337'),
	('00000000-0000-0000-0000-000000000000', 597, 'cloc52c4ejhp', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-14 22:52:06.379955+00', '2026-07-15 00:40:16.656327+00', 'xu6zewdtnqub', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 614, 'ijxa34atov5r', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-14 23:44:51.271772+00', '2026-07-15 00:43:20.885199+00', 'ojugnc3g5kpm', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 612, 'bx27oxjxajey', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-14 23:31:10.456566+00', '2026-07-15 00:49:41.518723+00', 'uhtdmjywyobe', 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 663, 'd33bvnjpy4vv', '806439f5-c268-4ef1-90e0-9c6b20afc521', true, '2026-07-15 16:56:07.157214+00', '2026-07-15 18:55:46.153982+00', '2ofmzidkv6ga', '601db310-1434-4629-9a40-42f24034b799'),
	('00000000-0000-0000-0000-000000000000', 618, 'jbytsujgjuix', '059a17b9-b1cc-4e43-b125-8d9496ffa8c3', true, '2026-07-15 00:02:14.579537+00', '2026-07-15 01:08:27.39864+00', NULL, 'e1d4128f-c060-4471-b6db-502cc94e5882'),
	('00000000-0000-0000-0000-000000000000', 677, 'du366ybmzt7x', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', true, '2026-07-15 18:24:41.716641+00', '2026-07-17 18:30:08.535817+00', '5i2inwyrw3xb', 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 628, '4vvqqllbviza', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-15 00:49:41.529861+00', '2026-07-15 15:15:26.164556+00', 'bx27oxjxajey', 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 862, 'jovfgcnocftk', '7e6ae7be-9b76-4400-94b1-a6571016ca87', false, '2026-07-17 20:03:28.663796+00', '2026-07-17 20:03:28.663796+00', '7dnfqfghkn3d', '86dcce47-18a2-4c3d-aff2-5a6663b858a3'),
	('00000000-0000-0000-0000-000000000000', 858, 'vedihew2espn', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', true, '2026-07-17 18:30:08.543046+00', '2026-07-17 20:19:20.040587+00', 'du366ybmzt7x', 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 641, 'n2u6vuftxl2w', '70b1eb3f-37e9-4501-983b-d172eaa3f1a5', true, '2026-07-15 02:24:21.491963+00', '2026-07-15 15:55:47.764589+00', 'd7gm463fubub', 'dcd603d1-e9c8-4508-bcd1-c218a4652b4d'),
	('00000000-0000-0000-0000-000000000000', 669, '644dd24k3flx', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', true, '2026-07-15 17:18:42.254425+00', '2026-07-15 19:02:17.494844+00', '25igrcgrimeh', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 680, '4uooojcv4n2t', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-15 18:44:00.268171+00', '2026-07-15 20:10:49.479018+00', 'ejvasv6i3zej', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 687, 'qluzew2snehj', '897e2dd9-2646-4d9e-a20d-f40da228e85e', true, '2026-07-15 18:56:14.432+00', '2026-07-15 20:12:47.168969+00', 'pubnr5p4m3hb', 'f5797a7a-db6a-4f39-9445-d38c518d4494'),
	('00000000-0000-0000-0000-000000000000', 626, '3tum5ohrhq5l', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-15 00:40:16.665475+00', '2026-07-15 20:53:41.138492+00', 'cloc52c4ejhp', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 797, 'ekxk75uqqps5', '897e2dd9-2646-4d9e-a20d-f40da228e85e', true, '2026-07-16 20:24:16.202413+00', '2026-07-17 20:37:24.439689+00', NULL, 'b43a5558-9cec-42cc-add7-06946ae6a0bf'),
	('00000000-0000-0000-0000-000000000000', 871, 'oq64x5a3bjkm', '2072a09e-3804-447f-a7f5-efacc0589e83', false, '2026-07-17 22:07:46.257687+00', '2026-07-17 22:07:46.257687+00', 'r5agpznowdse', 'aa97494e-a270-4567-9646-872c79226fc9'),
	('00000000-0000-0000-0000-000000000000', 711, 'pcvd6h5bwezz', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-15 20:53:41.149263+00', '2026-07-15 22:47:24.384055+00', '3tum5ohrhq5l', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 756, 'pibij6hb765j', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-16 01:36:54.682332+00', '2026-07-16 16:17:45.424021+00', 'ozajh5pzgcl3', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 867, 'reuy63mni4q2', '897e2dd9-2646-4d9e-a20d-f40da228e85e', true, '2026-07-17 20:37:24.451615+00', '2026-07-17 22:47:54.054374+00', 'ekxk75uqqps5', 'b43a5558-9cec-42cc-add7-06946ae6a0bf'),
	('00000000-0000-0000-0000-000000000000', 832, 'fsxwjinrmzz2', '63d5d908-34a0-4daa-94f4-91cb329f7d17', true, '2026-07-17 01:27:06.238688+00', '2026-07-17 15:23:56.924508+00', NULL, '86f8d9dc-a06c-4c0f-830a-b1e9a3979d81'),
	('00000000-0000-0000-0000-000000000000', 759, 'pkvivfxnppc3', '4601c73d-a873-4b9f-901b-0998d5536c9c', true, '2026-07-16 15:15:26.476427+00', '2026-07-16 16:26:11.267676+00', '5amssoiegabq', 'acca3d58-de24-42cb-b800-53d630cbee6a'),
	('00000000-0000-0000-0000-000000000000', 835, 'dcl6ufl643us', '63d5d908-34a0-4daa-94f4-91cb329f7d17', false, '2026-07-17 15:23:56.948066+00', '2026-07-17 15:23:56.948066+00', 'fsxwjinrmzz2', '86f8d9dc-a06c-4c0f-830a-b1e9a3979d81'),
	('00000000-0000-0000-0000-000000000000', 799, 'yeqnquyxzdqm', '2072a09e-3804-447f-a7f5-efacc0589e83', true, '2026-07-16 20:26:19.18127+00', '2026-07-17 15:52:51.857976+00', '4o2cvre6ba6f', 'aa97494e-a270-4567-9646-872c79226fc9'),
	('00000000-0000-0000-0000-000000000000', 721, 'zvqjukvsnyne', '4601c73d-a873-4b9f-901b-0998d5536c9c', false, '2026-07-15 22:52:07.22975+00', '2026-07-15 22:52:07.22975+00', '2dok62uzoh5r', '94b7b29c-4468-4912-97b4-032ed6d78d83'),
	('00000000-0000-0000-0000-000000000000', 875, 'weutjnbelru5', '17d5d747-fdd1-4d4f-88cc-aa2909995088', false, '2026-07-20 15:25:14.606954+00', '2026-07-20 15:25:14.606954+00', 'olin3gsnqtik', 'fb9a4b3f-c26e-4ae4-83fe-5076df090d85'),
	('00000000-0000-0000-0000-000000000000', 723, 'fbfrzrueuwqn', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', false, '2026-07-15 22:55:34.013803+00', '2026-07-15 22:55:34.013803+00', 'g75jdvtdigjn', '01f835a7-3831-4742-992f-cf6674793d9a'),
	('00000000-0000-0000-0000-000000000000', 746, 'fdnms66fdsn7', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-16 00:39:21.92771+00', '2026-07-16 17:13:36.797767+00', 'na4fyf4dyphf', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 725, 'u2zmmne2ngmt', '806439f5-c268-4ef1-90e0-9c6b20afc521', true, '2026-07-15 23:00:56.619385+00', '2026-07-20 15:48:25.949598+00', '3zrf4qawwsss', '601db310-1434-4629-9a40-42f24034b799'),
	('00000000-0000-0000-0000-000000000000', 785, 'tmrhw2uh7mss', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-16 19:17:12.716279+00', '2026-07-17 16:02:37.560696+00', 'a3kh3ltrliy7', 'bec1b2b0-d2b3-41d9-ad73-aef1de890f07'),
	('00000000-0000-0000-0000-000000000000', 754, 'ti2zipzwrz2j', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-16 01:29:19.093194+00', '2026-07-16 18:04:30.675912+00', 'n3vxguxfxb65', '03a772f2-0169-4361-8dd1-a07b13ab2a46'),
	('00000000-0000-0000-0000-000000000000', 838, 'e323zjsbadh6', '2072a09e-3804-447f-a7f5-efacc0589e83', true, '2026-07-17 15:52:51.867084+00', '2026-07-17 20:07:52.460255+00', 'yeqnquyxzdqm', 'aa97494e-a270-4567-9646-872c79226fc9'),
	('00000000-0000-0000-0000-000000000000', 879, '7fd3jbetvmvq', '4b4cc46b-65be-4faa-9d06-81e4d6893343', false, '2026-07-20 15:56:38.449805+00', '2026-07-20 15:56:38.449805+00', '7jhprv5qlddb', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 880, '4vnubcvffyhd', '6901712f-b020-4eec-83eb-13d1eff277c0', false, '2026-07-20 15:56:49.210878+00', '2026-07-20 15:56:49.210878+00', NULL, '5cdf3a66-3c74-4f91-8e97-138d57988c8d'),
	('00000000-0000-0000-0000-000000000000', 782, 'cmsigaj2372q', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-16 18:04:32.886295+00', '2026-07-16 19:37:15.189002+00', NULL, 'beee164f-ba85-4512-b1df-1971368dc31d'),
	('00000000-0000-0000-0000-000000000000', 716, '5og2pc6uhz7i', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-15 22:47:24.405646+00', '2026-07-16 00:03:15.889889+00', 'pcvd6h5bwezz', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 760, 'vgaqaaiqyxgj', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-16 15:31:18.002732+00', '2026-07-16 19:54:21.554115+00', '34tn3twiwwgp', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 736, '5bg4z377zdou', 'eebcbe52-7dee-4bb6-85e1-391df30b99d0', false, '2026-07-16 00:07:47.93225+00', '2026-07-16 00:07:47.93225+00', 'haqic6vqfz2c', '191f5362-6560-431b-84cc-16a171e0f679'),
	('00000000-0000-0000-0000-000000000000', 796, 'us5zqnu7xfl4', '897e2dd9-2646-4d9e-a20d-f40da228e85e', false, '2026-07-16 20:24:14.465836+00', '2026-07-16 20:24:14.465836+00', 'qu56fqw4nizs', 'f5797a7a-db6a-4f39-9445-d38c518d4494'),
	('00000000-0000-0000-0000-000000000000', 724, 'wgqf34yy2wxp', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', true, '2026-07-15 22:57:04.832237+00', '2026-07-16 00:17:37.811862+00', '4gumtxx3xyta', '095f2732-3a14-4a1a-9fb6-49a1bd4e8ae0'),
	('00000000-0000-0000-0000-000000000000', 727, 'na4fyf4dyphf', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-15 23:19:40.352683+00', '2026-07-16 00:39:21.920939+00', 'gew5jooyqnap', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 787, '4o2cvre6ba6f', '2072a09e-3804-447f-a7f5-efacc0589e83', true, '2026-07-16 19:21:58.283619+00', '2026-07-16 20:26:19.173024+00', '7gxaagvxllnd', 'aa97494e-a270-4567-9646-872c79226fc9'),
	('00000000-0000-0000-0000-000000000000', 722, 'lhktmlh7x3nm', '4601c73d-a873-4b9f-901b-0998d5536c9c', true, '2026-07-15 22:52:18.010873+00', '2026-07-16 00:56:38.057241+00', NULL, 'acca3d58-de24-42cb-b800-53d630cbee6a'),
	('00000000-0000-0000-0000-000000000000', 726, 'ngtcrka2nvy7', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-15 23:06:27.001712+00', '2026-07-16 01:04:13.9363+00', 'ptjmyx7zezet', 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 729, 'n3vxguxfxb65', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-15 23:29:57.060698+00', '2026-07-16 01:29:19.081425+00', 'lmrcdbn4f2yd', '03a772f2-0169-4361-8dd1-a07b13ab2a46'),
	('00000000-0000-0000-0000-000000000000', 743, '3llp2vvzzz6t', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', true, '2026-07-16 00:17:37.819285+00', '2026-07-16 01:30:35.630055+00', 'wgqf34yy2wxp', '095f2732-3a14-4a1a-9fb6-49a1bd4e8ae0'),
	('00000000-0000-0000-0000-000000000000', 755, 'eag4uavbdw7s', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', false, '2026-07-16 01:30:35.642372+00', '2026-07-16 01:30:35.642372+00', '3llp2vvzzz6t', '095f2732-3a14-4a1a-9fb6-49a1bd4e8ae0'),
	('00000000-0000-0000-0000-000000000000', 735, 'ozajh5pzgcl3', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-16 00:03:15.902717+00', '2026-07-16 01:36:54.674347+00', '5og2pc6uhz7i', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 749, 'bcozh5uicoos', '4601c73d-a873-4b9f-901b-0998d5536c9c', true, '2026-07-16 00:56:38.067773+00', '2026-07-16 02:05:38.110143+00', 'lhktmlh7x3nm', 'acca3d58-de24-42cb-b800-53d630cbee6a'),
	('00000000-0000-0000-0000-000000000000', 757, '5amssoiegabq', '4601c73d-a873-4b9f-901b-0998d5536c9c', true, '2026-07-16 02:05:38.126867+00', '2026-07-16 15:15:26.451728+00', 'bcozh5uicoos', 'acca3d58-de24-42cb-b800-53d630cbee6a'),
	('00000000-0000-0000-0000-000000000000', 747, '34tn3twiwwgp', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-16 00:44:33.55842+00', '2026-07-16 15:31:17.996095+00', 'ckep2ctqkge6', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 751, '44qx2glpclpm', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-16 01:04:13.953163+00', '2026-07-16 15:31:52.535673+00', 'ngtcrka2nvy7', 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 761, 'mqphawztrlya', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', false, '2026-07-16 15:31:52.541766+00', '2026-07-16 15:31:52.541766+00', '44qx2glpclpm', 'daf0b24f-07da-4d49-ba37-a480b5c6dfe8'),
	('00000000-0000-0000-0000-000000000000', 792, 'qn5vz33e6twc', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-16 19:54:21.560429+00', '2026-07-16 21:01:23.491406+00', 'vgaqaaiqyxgj', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 778, 'ikk5cimdpdxc', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-16 17:37:30.224109+00', '2026-07-16 21:06:56.827465+00', 'jix3brfwnen3', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 798, '2ty34ktpfvxn', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-16 20:25:39.496405+00', '2026-07-16 22:47:57.030991+00', 'qktqfu4qbggk', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 803, 'ys45scc4vsqh', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-16 20:47:06.489516+00', '2026-07-16 22:55:24.339966+00', 'hk5rlatmf4tr', 'beee164f-ba85-4512-b1df-1971368dc31d'),
	('00000000-0000-0000-0000-000000000000', 806, 'o6aatpe5ichq', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-16 21:06:56.832931+00', '2026-07-16 22:59:23.0718+00', 'ikk5cimdpdxc', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 805, 'y3gv2rigbk4z', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-16 21:01:23.501513+00', '2026-07-16 23:07:12.072102+00', 'qn5vz33e6twc', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 809, 'bqixvghroc6u', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-16 22:47:57.041495+00', '2026-07-16 23:57:18.699566+00', '2ty34ktpfvxn', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 851, 'bjh25oa2alpi', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-17 17:34:19.148671+00', '2026-07-17 20:21:51.844622+00', 'un46dw2z5jrl', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 818, 'edzmhkdmu3ww', '4b4cc46b-65be-4faa-9d06-81e4d6893343', true, '2026-07-16 23:07:12.074232+00', '2026-07-17 00:19:36.078813+00', 'y3gv2rigbk4z', '9243c5cf-2e17-4465-8233-155233e525b4'),
	('00000000-0000-0000-0000-000000000000', 821, 'smvuuihqev6n', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-16 23:57:18.704053+00', '2026-07-17 00:57:27.199255+00', 'bqixvghroc6u', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 863, 'r5agpznowdse', '2072a09e-3804-447f-a7f5-efacc0589e83', true, '2026-07-17 20:07:52.468951+00', '2026-07-17 22:07:46.250799+00', 'e323zjsbadh6', 'aa97494e-a270-4567-9646-872c79226fc9'),
	('00000000-0000-0000-0000-000000000000', 861, 'wxzttyv6i4sy', '17d5d747-fdd1-4d4f-88cc-aa2909995088', true, '2026-07-17 20:02:10.409345+00', '2026-07-17 23:02:51.481144+00', NULL, 'fb9a4b3f-c26e-4ae4-83fe-5076df090d85'),
	('00000000-0000-0000-0000-000000000000', 815, 'muyxxwcnxcqq', '000ed70a-a668-4379-82c6-a82e7d523543', true, '2026-07-16 22:59:23.077476+00', '2026-07-17 23:04:11.173383+00', 'o6aatpe5ichq', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 872, 'uxx6vmtabkmo', '897e2dd9-2646-4d9e-a20d-f40da228e85e', true, '2026-07-17 22:47:54.071332+00', '2026-07-20 15:31:52.196946+00', 'reuy63mni4q2', 'b43a5558-9cec-42cc-add7-06946ae6a0bf'),
	('00000000-0000-0000-0000-000000000000', 876, 'pw4e7esf2urb', '897e2dd9-2646-4d9e-a20d-f40da228e85e', false, '2026-07-20 15:31:52.203502+00', '2026-07-20 15:31:52.203502+00', 'uxx6vmtabkmo', 'b43a5558-9cec-42cc-add7-06946ae6a0bf'),
	('00000000-0000-0000-0000-000000000000', 881, 'qngmkd2ro7n6', '000ed70a-a668-4379-82c6-a82e7d523543', false, '2026-07-20 16:36:30.543872+00', '2026-07-20 16:36:30.543872+00', '6azgmcktxjlx', '6380e063-e266-4eef-badb-30b3a86c78c6'),
	('00000000-0000-0000-0000-000000000000', 814, 'ngmbxvo4yldu', '855ecf57-5a53-4e36-91db-d4e607a8bb42', true, '2026-07-16 22:55:24.341835+00', '2026-07-17 02:15:56.37749+00', 'ys45scc4vsqh', 'beee164f-ba85-4512-b1df-1971368dc31d'),
	('00000000-0000-0000-0000-000000000000', 836, 'n45frfgztofg', '56ea6af7-d061-4ea7-8793-72641fba5d91', false, '2026-07-17 15:41:27.462613+00', '2026-07-17 15:41:27.462613+00', NULL, 'eb479d45-e0e5-4443-a012-cb0dce0876fb'),
	('00000000-0000-0000-0000-000000000000', 828, 'r5p2mbrwil4k', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-17 00:57:27.220553+00', '2026-07-17 16:01:54.817267+00', 'smvuuihqev6n', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 840, 'pnlpxgdn75ya', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', true, '2026-07-17 16:02:37.561804+00', '2026-07-17 17:01:32.933068+00', 'tmrhw2uh7mss', 'bec1b2b0-d2b3-41d9-ad73-aef1de890f07'),
	('00000000-0000-0000-0000-000000000000', 839, 'un46dw2z5jrl', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', true, '2026-07-17 16:01:54.8287+00', '2026-07-17 17:34:19.13644+00', 'r5p2mbrwil4k', '33c7d930-61c0-4926-be41-ef8c80fb4a75'),
	('00000000-0000-0000-0000-000000000000', 857, 't7frk2stwjbj', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', true, '2026-07-17 18:25:11.542826+00', '2026-07-17 19:26:07.629985+00', NULL, 'aa96f9c3-ea7b-44e6-ab1a-4a6f5db828d4'),
	('00000000-0000-0000-0000-000000000000', 859, '7dnfqfghkn3d', '7e6ae7be-9b76-4400-94b1-a6571016ca87', true, '2026-07-17 19:05:08.114426+00', '2026-07-17 20:03:28.652164+00', NULL, '86dcce47-18a2-4c3d-aff2-5a6663b858a3');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: internal_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."internal_roles" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
	(2, 'Lider'),
	(3, 'Admin'),
	(4, 'Coordinador'),
	(1, 'Colaborador'),
	(5, 'Ejecutivo de Comunicación');


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."specialties" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
	(1, 'Audiovisual'),
	(2, 'Relaciones Públicas'),
	(3, 'Producción'),
	(4, 'Diseño'),
	(5, 'Contenido'),
	(6, 'Programación'),
	(9, 'Staff');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "full_name", "avatar_url", "phone", "is_admin", "created_at", "email", "internal_role", "specialty", "leader_id", "is_active", "role_id", "specialty_id") VALUES
	('5be7438a-1075-473d-a34a-dec6320e2ee0', 'Omar Prueba Cliente', NULL, NULL, false, '2026-07-09 18:31:37.068711+00', 'ademirluna13@tolkogroup.com', NULL, NULL, NULL, false, NULL, NULL),
	('e2b245b6-ac6b-4811-b24b-2b23dfb0a8be', 'Nicolas Mariscal', NULL, NULL, false, '2026-07-10 00:15:07.869937+00', 'NICOLAS.MARISCAL@grupobimbo.com', NULL, NULL, NULL, true, NULL, NULL),
	('403debcb-7c38-4145-a9ca-3390e1f2b7cd', 'Mariana Hernández', NULL, NULL, false, '2026-07-10 15:58:18.606392+00', 'mariana.hernandez@cydsa.com', NULL, NULL, NULL, true, NULL, NULL),
	('b4c42663-23b0-4426-a256-4deae497e473', 'Gonzalez Paola ', NULL, NULL, false, '2026-07-10 16:05:03.602888+00', 'paola.gonzalezc@posadas.com', NULL, NULL, NULL, true, NULL, NULL),
	('e74cc442-94cd-4986-84ce-e7d96385b779', 'Ricardo Palacio', NULL, NULL, false, '2026-07-10 16:28:09.593196+00', 'ricado.palacio@enfragen.com', NULL, NULL, NULL, true, NULL, NULL),
	('7f4722ee-e0f8-44d8-ba09-32b37055f8a2', 'Natalia Jiménez', NULL, NULL, false, '2026-07-10 16:32:55.226688+00', 'Natalia.Jimenez@glenfarnecompanies.com', NULL, NULL, NULL, true, NULL, NULL),
	('000ed70a-a668-4379-82c6-a82e7d523543', 'Jared Cornejo', 'https://ui-avatars.com/api/?name=Jared%20Cornejo&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-14 19:54:27.275693+00', 'jcornejo@tolkogroup.com', '1', NULL, 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 1, 4),
	('946ce820-aea2-495b-8856-9593826d2994', 'Arelí Fares', NULL, NULL, false, '2026-07-16 16:49:57.732415+00', 'a.fares@ebc.edu.mx', NULL, NULL, NULL, true, NULL, NULL),
	('75229c3d-19e2-47e0-b351-8e588d6f674d', 'Paulety Zaragoza', NULL, NULL, false, '2026-07-16 16:50:17.628818+00', 'p.zaragoza001@ebc.edu.mx', NULL, NULL, NULL, true, NULL, NULL),
	('0266ac4d-b3e8-45fa-b994-aab1020f13f6', 'Prueba Tolko', NULL, '551345678', false, '2026-06-16 16:29:05.928667+00', 'pruebatolko123@gmail.com', NULL, NULL, NULL, true, NULL, NULL),
	('a5709d48-d774-42b3-bf57-5e061ff25d87', 'Sergio Serrano', 'https://ui-avatars.com/api/?name=Sergio%20Serrano&background=1E1E24&color=D3002D&size=200&bold=true', '5512345678', false, '2026-05-28 19:03:57.479074+00', 'sserrano@tolkogroup.com', 'Lider', 'Diseño', NULL, true, 2, 4),
	('855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Andrea Velez', 'https://ui-avatars.com/api/?name=Andrea%20Velez&background=1E1E24&color=D3002D&size=200&bold=true', '5513245678', false, '2026-05-28 19:05:24.094257+00', 'avelez@tolkogroup.com', 'Coordinador', 'Diseño', 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 4, 4),
	('6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', 'Brenda Berenice Ramírez Vaca', NULL, '555555555', false, '2026-05-28 19:29:34.487578+00', 'BBRV@novonordisk.com', NULL, NULL, NULL, true, NULL, NULL),
	('38fc9683-4851-42fd-9d97-a73e1fecfde9', 'Melissa Martínez', NULL, NULL, false, '2026-05-28 19:56:34.682375+00', 'melissa.martinez@nike.com', NULL, NULL, NULL, true, NULL, NULL),
	('b19cca69-3f8c-4e00-929a-58df124275bc', 'Ximena Flores', NULL, '5512345678', false, '2026-06-25 19:07:11.107747+00', 'pruebaxime123@tolkogroup.com', NULL, NULL, NULL, true, NULL, NULL),
	('39181f00-f70d-454a-ab49-d2612488e8f2', 'Naxiely Olguin Prueba', NULL, '5512346578', false, '2026-06-25 19:24:09.076699+00', 'pruebanaxnike@tolkogroup.com', NULL, NULL, NULL, true, NULL, NULL),
	('9712dc1c-b1e0-4ee5-a42e-b7696677bf2b', 'Prueba Andrea Velez', NULL, '5512345678', false, '2026-06-25 19:32:46.145333+00', 'pruebaandy@tolkogroup.com', NULL, NULL, NULL, true, NULL, NULL),
	('a6f75547-6426-469a-9248-1489a23c199d', 'Karina Teruyo Velasco Molina', NULL, NULL, false, '2026-07-09 23:47:55.283145+00', 'karina.velasco@alsea.net', NULL, NULL, NULL, true, NULL, NULL),
	('ae004f1d-7201-490d-825b-2e5e1babee6c', 'María Elena Ramirez', NULL, NULL, false, '2026-07-10 00:16:15.449241+00', 'maria.e.ramirez@grupobimbo.com', NULL, NULL, NULL, true, NULL, NULL),
	('b62b0628-d46c-4285-a67c-cf67793786d2', 'Frank Zeller', NULL, NULL, false, '2026-07-10 15:59:28.656114+00', 'frank.zeller@cydsa.com', NULL, NULL, NULL, true, NULL, NULL),
	('cc5d4b45-dd70-48d5-9cbe-3eb98539ac15', 'Sofía Vazquez', NULL, NULL, false, '2026-07-10 16:05:55.057218+00', 'sofia.vazquez@nike.com', NULL, NULL, NULL, true, NULL, NULL),
	('0f0eca6a-1cc7-42d9-959b-2544cb036d36', 'Juan Manuel Cruz', NULL, NULL, false, '2026-07-10 16:28:54.569771+00', 'juan.cruz@enfragen.com', NULL, NULL, NULL, true, NULL, NULL),
	('45e18393-6642-47cc-b1dc-e0595089eb85', 'Andrés Bonilla', NULL, NULL, false, '2026-07-10 16:37:18.882924+00', 'andres.bonilla@glenfarnecompanies.com', NULL, NULL, NULL, true, NULL, NULL),
	('3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Valeria Flores', NULL, NULL, false, '2026-07-14 23:29:18.781026+00', 'floresvaleria@la-bridgestone.com', NULL, NULL, NULL, true, NULL, NULL),
	('404e4037-6517-4a5e-b6e5-0f91dccf4aae', 'Georgina Rodríguez', NULL, NULL, false, '2026-07-16 16:50:36.460071+00', 'g.rodriguez077@ebc.edu.mx', NULL, NULL, NULL, true, NULL, NULL),
	('3e49085a-6eaa-456c-9d53-6997d4d30491', 'Daniela Paola Juarez Martinez', NULL, NULL, false, '2026-07-10 00:03:29.740426+00', 'daniela.juarez@alsea.net', NULL, NULL, NULL, true, NULL, NULL),
	('6589ea5b-6c12-4aff-889c-16d125c2ec99', 'Ivonne Livier Castro Varela', NULL, NULL, false, '2026-07-10 00:16:51.584963+00', 'ivonne.castro@grupobimbo.com', NULL, NULL, NULL, true, NULL, NULL),
	('af62bac6-af87-40f4-b02c-cb46fc5d2b52', 'Vazquez Andres ', NULL, NULL, false, '2026-07-10 16:02:22.502685+00', 'andres.vazquez@posadas.com', NULL, NULL, NULL, true, NULL, NULL),
	('4d21cc67-d670-4142-9620-032f0dcbecf0', 'Mauricio Marín Y Kall', NULL, NULL, false, '2026-07-10 16:12:59.304772+00', 'FMIO@novonordisk.com', NULL, NULL, NULL, true, NULL, NULL),
	('5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Bruno Admin', 'https://ui-avatars.com/api/?name=Bruno%20Admin&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:21:31.894624+00', 'brunoadmin@tolkogroup.com', 'Admin', NULL, NULL, true, 3, NULL),
	('6901712f-b020-4eec-83eb-13d1eff277c0', 'Cinthia Lazcano', 'https://ui-avatars.com/api/?name=Cinthia%20Lazcano&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:28:20.077088+00', 'clazcano@tolkogroup.com', 'Admin', NULL, NULL, true, 3, NULL),
	('1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Fabian Admin', 'https://ui-avatars.com/api/?name=Fabian%20Admin&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:19:08.051497+00', 'fabianadmin@tolkogroup.com', 'Admin', NULL, NULL, true, 3, NULL),
	('7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Omar Admin', 'https://ui-avatars.com/api/?name=Omar%20Admin&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:18:09.938128+00', 'omaradmin@tolkogroup.com', 'Admin', NULL, NULL, true, 3, NULL),
	('198c855a-2872-44f0-8153-f7c60c93f299', 'Lucas Lagos', NULL, NULL, false, '2026-07-10 16:29:39.320204+00', 'lucas.lagos@enfragen.com', NULL, NULL, NULL, true, NULL, NULL),
	('d946a934-56bd-4e23-b527-c27c927ec455', 'Natalia Gualteros', NULL, NULL, false, '2026-07-10 16:38:13.420872+00', 'natalia.gualteros@glenfarne.com', NULL, NULL, NULL, true, NULL, NULL),
	('989c4298-86d3-416a-998f-2e82b3f9e553', 'Miriam Chávez', NULL, NULL, false, '2026-07-16 16:36:00.405932+00', 'direcciongeneral@amsofipo.mx', NULL, NULL, NULL, true, NULL, NULL),
	('0be8c39b-72f0-4d3e-90ec-6713ed8f1325', 'Adriana Erazo', NULL, NULL, false, '2026-07-16 16:36:33.500313+00', 'aerazo@biopappel.com', NULL, NULL, NULL, true, NULL, NULL),
	('debcf540-88f6-4536-bd0f-5b30f2aa4141', 'Andrea Béjar', NULL, NULL, false, '2026-07-16 16:36:57.45898+00', 'abejar@biopappel.com', NULL, NULL, NULL, true, NULL, NULL),
	('d4fdb7c2-714a-40cc-bc4a-4299a20e0627', 'Andrea Rosellón', NULL, NULL, false, '2026-07-16 16:37:23.756964+00', 'arosellon@biopappel.com', NULL, NULL, NULL, true, NULL, NULL),
	('d32486d5-9d77-4934-9130-913398aa0ecc', 'Erick Padilla', NULL, NULL, false, '2026-07-16 16:37:47.399613+00', 'epadilla@biopappel.com', NULL, NULL, NULL, true, NULL, NULL),
	('6996baad-8277-4c4b-b1c8-cbc4fac1005b', 'Regina García Velarde', NULL, NULL, false, '2026-07-16 16:38:26.83135+00', 'regina.velarde@crediclub.com', NULL, NULL, NULL, true, NULL, NULL),
	('c5711c22-a164-4d7f-8ad3-089635cb544c', 'Paulina Ramírez', NULL, NULL, false, '2026-07-16 16:38:55.226096+00', 'paulina.ramirez@crediclub.com', NULL, NULL, NULL, true, NULL, NULL),
	('e19b0182-0a1e-4637-b85d-ba337ba2d133', 'Karla Heras', NULL, NULL, false, '2026-07-16 22:38:29.908159+00', 'karla.heras@grupobimbo.com', NULL, NULL, NULL, true, NULL, NULL),
	('83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Naxiely Olguin', 'https://ui-avatars.com/api/?name=Naxiely%20Olguin&background=1E1E24&color=D3002D&size=200&bold=true', '5512345678', false, '2026-05-28 19:14:08.022497+00', 'nolguin@tolkogroup.com', 'Coordinador', 'Diseño', 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 4, 4),
	('63d5d908-34a0-4daa-94f4-91cb329f7d17', 'María Belén Ramírez', 'https://ui-avatars.com/api/?name=Mar%C3%ADa%20Bel%C3%A9n%20Ram%C3%ADrez&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:27:30.335286+00', 'mbramirez@tolkogroup.com', 'Reviewer', 'Diseño', 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 1, 4),
	('897e2dd9-2646-4d9e-a20d-f40da228e85e', 'Samanta Hernández', 'https://ui-avatars.com/api/?name=Samanta%20Hern%C3%A1ndez&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:24:15.243558+00', 'shernandez@tolkogroup.com', 'Reviewer', 'Diseño', 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 1, 4),
	('aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Prueba Lider Tolko', 'https://ui-avatars.com/api/?name=Prueba%20Lider%20Tolko&background=1E1E24&color=D3002D&size=200&bold=true', '5512345678', false, '2026-06-16 16:31:13.661699+00', 'pruebalider@gmail.com', 'Lider', 'Programación', NULL, true, 2, 6),
	('e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Ximena Flores', 'https://ui-avatars.com/api/?name=Ximena%20Flores&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:55:48.439459+00', 'xflores@tolkogroup.com', 'Coordinador', 'Programación', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', true, 5, 5),
	('f018a13c-779a-4435-92c2-53b133c2a72d', 'María del Mar Salinas', 'https://ui-avatars.com/api/?name=Mar%C3%ADa%20del%20Mar%20Salinas&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:56:49.541446+00', 'msalinas@tolkogroup.com', 'Coordinador', 'Contenido', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', true, 5, 5),
	('70b1eb3f-37e9-4501-983b-d172eaa3f1a5', 'Verónica Rodríguez', 'https://ui-avatars.com/api/?name=Ver%C3%B3nica%20Rodr%C3%ADguez&background=1E1E24&color=D3002D&size=200&bold=true', '5591874923', false, '2026-07-03 20:58:57.444801+00', 'vrodriguez@tolkogroup.com', 'Reviewer', 'Contenido', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', true, 1, 9),
	('54733af9-6db1-4683-b473-21723c877449', 'Brenda Bibiano', NULL, NULL, false, '2026-07-10 00:13:34.108663+00', 'bbibiano@tolkogroup.com', NULL, NULL, NULL, true, NULL, NULL),
	('bc8aee4c-21f6-47fb-9a65-f284c78aa7d5', 'Karem Berenice Zamora Burgos', NULL, NULL, false, '2026-07-10 00:18:46.918239+00', 'karem.zamora@grupobimbo.com', NULL, NULL, NULL, true, NULL, NULL),
	('ea62dff2-4c5b-43a7-8c10-1ad344e01b3c', 'Salmeron Christian ', NULL, NULL, false, '2026-07-10 16:03:33.869379+00', 'christian.salmeron@posadas.com', NULL, NULL, NULL, true, NULL, NULL),
	('befb88e9-fd13-4f79-9622-d6c6bdd52be7', 'Liyen Chávez', NULL, NULL, false, '2026-07-10 16:23:05.352027+00', 'SVGX@novonordisk.com', NULL, NULL, NULL, true, NULL, NULL),
	('156d7e1c-904f-41d9-975e-58fbc686f677', 'Patricia Garcés', NULL, NULL, false, '2026-07-10 16:30:55.673445+00', 'arleth.garces@enfragen.com', NULL, NULL, NULL, true, NULL, NULL),
	('79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Antonio Sánchez', 'https://ui-avatars.com/api/?name=Antonio%20S%C3%A1nchez&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:44:48.331307+00', 'asanchez@tolkogroup.com', 'Coordinador', 'Relaciones Públicas', '2072a09e-3804-447f-a7f5-efacc0589e83', true, 5, 2),
	('806439f5-c268-4ef1-90e0-9c6b20afc521', 'Martín García', 'https://ui-avatars.com/api/?name=Mart%C3%ADn%20Garc%C3%ADa&background=1E1E24&color=D3002D&size=200&bold=true', '', false, '2026-07-03 20:35:57.152557+00', 'mgarcia@tolkogroup.com', 'Reviewer', 'Audiovisual', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, 1, 1),
	('473016e7-f5e4-451e-a889-8d19a11484f2', 'Enrique Pardo', 'https://ui-avatars.com/api/?name=Enrique%20Pardo&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:45:22.391456+00', 'epardo@tolkogroup.com', 'Reviewer', 'Relaciones Públicas', '2072a09e-3804-447f-a7f5-efacc0589e83', true, 5, 2),
	('4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Mariana Vega', 'https://ui-avatars.com/api/?name=Mariana%20Vega&background=1E1E24&color=D3002D&size=200&bold=true', '', false, '2026-07-03 20:53:31.758661+00', 'mvega@tolkogroup.com', 'Coordinador', 'Contenido', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', true, 4, 5),
	('98dcd0ea-33e1-430d-b0ee-15e9211e0849', 'Sonia García ', NULL, NULL, false, '2026-07-16 16:39:34.643523+00', 'soniag@amib.com.mx', NULL, NULL, NULL, true, NULL, NULL),
	('059a17b9-b1cc-4e43-b125-8d9496ffa8c3', 'Laura García', 'https://ui-avatars.com/api/?name=Laura%20Garc%C3%ADa&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:58:16.909751+00', 'lgarcia@tolkogroup.com', 'Reviewer', 'Staff', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', true, 1, 9),
	('0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', 'Omar Luna', 'https://ui-avatars.com/api/?name=Omar%20Luna&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:27:26.078782+00', 'oluna@tolkogroup.com', 'Reviewer', 'Programación', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', true, 1, 6),
	('e8a43ce5-b3fa-4b23-a8af-256872323fd5', 'Berenice Castillejos ', NULL, NULL, false, '2026-07-16 16:39:53.959785+00', 'bcastillejos@amib.com.mx', NULL, NULL, NULL, true, NULL, NULL),
	('bef74040-1279-4b76-8cd8-497e37711cd9', 'Eva Barbosa ', NULL, NULL, false, '2026-07-16 16:40:12.144788+00', 'eva.barbosa@bayer.com', NULL, NULL, NULL, true, NULL, NULL),
	('7a36964d-aefa-49e3-938c-167fcec411a0', 'Catalina Rodríguez', NULL, NULL, false, '2026-07-16 16:40:32.753459+00', 'catalina.rodriguez1@bayer.com', NULL, NULL, NULL, true, NULL, NULL),
	('d35996b1-2855-424e-bb6e-08d14a02b323', 'Lorena Gallardo ', NULL, NULL, false, '2026-07-16 16:40:51.213665+00', 'lorena.gallardo@bayer.com', NULL, NULL, NULL, true, NULL, NULL),
	('8caa4432-c8a5-44fa-bdad-e38613f029e1', 'Sergio David Reyna', NULL, NULL, false, '2026-07-16 22:42:48.153166+00', 'sergio.reyna@grupobimbo.com', NULL, NULL, NULL, true, NULL, NULL),
	('17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Fabian Rodriguez', 'https://ui-avatars.com/api/?name=Fabian%20Rodriguez&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:24:24.751136+00', 'frodriguez@tolkogroup.com', 'Reviewer', 'Programación', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', true, 4, 6),
	('9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', 'Alessandra Hernandez', 'https://ui-avatars.com/api/?name=Alessandra%20Hernandez&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:31:48.657613+00', 'alehernandez@tolkogroup.com', 'Reviewer', 'Diseño', 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 1, 4),
	('7dc57b73-9e2d-4c2a-9447-f5c8d49a9909', 'Scarlett Mendez', 'https://ui-avatars.com/api/?name=Scarlett%20Mendez&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:25:31.730607+00', 'smendez@tolkogroup.com', 'Reviewer', 'Diseño', 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 1, 4),
	('6d346f9b-3c06-47bb-9c2f-243bcc93b744', 'Luis Ernesto Castillo', 'https://ui-avatars.com/api/?name=Luis%20Ernesto%20Castillo&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:34:48.309836+00', 'lcastillo@tolkogroup.com', 'Reviewer', 'Diseño', 'a5709d48-d774-42b3-bf57-5e061ff25d87', true, 1, 4),
	('c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Bruno Salgado', 'https://ui-avatars.com/api/?name=Bruno%20Salgado&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:23:35.743617+00', 'bsalgado@tolkogroup.com', 'Lider', 'Programación', NULL, true, 2, 6),
	('e55de437-6a6c-45e2-b1f2-607ef41f22fa', 'Wendolin Romero', 'https://ui-avatars.com/api/?name=Wendolin%20Romero&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:22:27.509979+00', 'wromero@tolkogroup.com', 'Reviewer', 'Programación', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', true, 1, 6),
	('b049d400-3d04-42c5-85c8-3c8732cf7ae7', 'Elí Morales', 'https://ui-avatars.com/api/?name=El%C3%AD%20Morales&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 17:48:02.203682+00', 'gmorales@tolkogroup.com', 'Lider', 'Audiovisual', NULL, true, 2, 1),
	('93bb792e-b541-48da-9901-d7e1878fdfb5', 'Ramsés Márquez', 'https://ui-avatars.com/api/?name=Rams%C3%A9s%20M%C3%A1rquez&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:37:10.015631+00', 'rmarquez@tolkogroup.com', 'Reviewer', 'Audiovisual', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, 1, 1),
	('5a4795df-85a2-4846-b2af-68899c613610', 'Kevin de la O', 'https://ui-avatars.com/api/?name=Kevin%20de%20la%20O&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:41:47.45065+00', 'kdelao@tolkogroup.com', 'Reviewer', 'Audiovisual', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, 1, 1),
	('56ea6af7-d061-4ea7-8793-72641fba5d91', 'Iván Ávila', 'https://ui-avatars.com/api/?name=Iv%C3%A1n%20%C3%81vila&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:42:24.549131+00', 'iavila@tolkogroup.com', 'Reviewer', 'Audiovisual', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, 1, 1),
	('4601c73d-a873-4b9f-901b-0998d5536c9c', 'Eduardo Espinosa', 'https://ui-avatars.com/api/?name=Eduardo%20Espinosa&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:41:09.772691+00', 'eespinosa@tolkogroup.com', 'Reviewer', 'Audiovisual', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', true, 1, 1),
	('2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Daniela Palma', 'https://ui-avatars.com/api/?name=Daniela%20Palma&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:52:05.16855+00', 'dpalma@tolkogroup.com', 'Lider', 'Contenido', NULL, true, 2, 5),
	('2072a09e-3804-447f-a7f5-efacc0589e83', 'Lizbeth Alberto', 'https://ui-avatars.com/api/?name=Lizbeth%20Alberto&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 19:58:06.17314+00', 'lalberto@tolkogroup.com', 'Lider', 'Relaciones Públicas', NULL, true, 2, 2),
	('eebcbe52-7dee-4bb6-85e1-391df30b99d0', 'Carlos Limón', 'https://ui-avatars.com/api/?name=Carlos%20Lim%C3%B3n&background=1E1E24&color=D3002D&size=200&bold=true', NULL, false, '2026-07-03 20:59:37.223261+00', 'climon@tolkogroup.com', 'Lider', 'Producción', NULL, true, 2, 3);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."audit_logs" ("id", "table_name", "record_id", "action", "old_data", "new_data", "performed_by", "created_at") VALUES
	('e60e1f26-6d88-42ac-ba80-d9cb58d8b6a0', 'request_tasks', 'fe9ae7b8-7e8b-44a3-9854-d39e4ade271c', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.youtube.com/watch?v=9xFP04mf93Y"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 16:51:29.445259+00'),
	('c0cba29e-d871-4ca0-bed9-47edb2a72633', 'request_tasks', 'fe9ae7b8-7e8b-44a3-9854-d39e4ade271c', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.youtube.com/watch?v=yezd-afdvjc"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 16:54:42.632549+00'),
	('e7d9b0b9-437a-4a6d-9d3f-8343476009bd', 'request_tasks', 'fe9ae7b8-7e8b-44a3-9854-d39e4ade271c', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.youtube.com/watch?v=yezd-afdvjc"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 17:06:53.857553+00'),
	('9ec07d01-77be-4177-b12a-0bfd74ec2621', 'request_tasks', 'b31648fc-a25b-4209-aa24-bf1fbc609460', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://tolkogroup.com/nike/Nike_LDP_EdicionEspecial_ADT2025.html"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 17:22:47.358372+00'),
	('07717389-10c6-4bd2-b6d9-b9063d45581a', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpbb?hl=es"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 17:57:58.584909+00'),
	('ec92e6af-17b8-4d3f-aaaa-9e8b76e586fe', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpbb?hl=es"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 18:02:24.172212+00'),
	('e725c896-9674-4e4d-87fc-6d51481ddf50', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpb"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 18:20:37.595403+00'),
	('7f22f25f-ffe7-48ec-8286-0c650bf74dc7', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpb"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 18:22:16.077245+00'),
	('15e2f089-9273-47fe-b768-80aa18efc6b6', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpb"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 18:22:46.804828+00'),
	('f723aad9-b3c4-41d0-8bbc-56a142032d57', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpb"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 18:38:24.196475+00'),
	('f6295a90-ff94-4cb5-b5f9-5fa1d615cc13', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpb"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 18:39:15.597128+00'),
	('264a365c-2f88-472c-8045-5ade08aa2d1b', 'request_tasks', 'be6f570b-6c34-437e-9ead-2fb1b7bbde22', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://pipeline.tolkogroup.com/colaborador"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 19:38:51.433626+00'),
	('a22d8272-57b7-4eff-8ce1-2237be8c4ebc', 'request_tasks', '2ab1e591-171c-4a57-9525-ff9c8a32ba56', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://pipeline.tolkogroup.com/colaborador"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-06 20:52:45.365654+00'),
	('9e97d9c0-ff15-4f72-82c5-f789fbc549af', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpb"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-07 23:30:07.609596+00'),
	('91185282-49c7-4aff-89be-6ed6406ec8f7', 'request_tasks', '141242a8-a52b-49cd-91ba-f64bdba2123a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://chromewebstore.google.com/detail/right-click-lorem-ipsum/jkobldjdbekfbmigpldmhmjfhcphfpb"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-08 01:07:57.396508+00'),
	('693b019b-a5de-4530-a036-cbc55067a1fc', 'request_tasks', '18369316-e24c-4e40-8e07-a1022e41a5af', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://gemini.google.com/gem/a279782b34da?usp=sharing"}', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 17:22:12.043728+00'),
	('5a31a044-bf51-49f2-97b3-bb439deab8b0', 'request_tasks', '18369316-e24c-4e40-8e07-a1022e41a5af', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://gemini.google.com/gem/a279782b34da?usp=sharing"}', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 17:22:53.850983+00'),
	('b97d1515-831f-4614-9e5a-ecd34669bcbf', 'request_tasks', '18369316-e24c-4e40-8e07-a1022e41a5af', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://gemini.google.com/gem/a279782b34da?usp=sharing"}', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 17:26:30.318675+00'),
	('996c7652-85a6-4e99-81a3-80f8f8dc72b9', 'request_tasks', '18369316-e24c-4e40-8e07-a1022e41a5af', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://gemini.google.com/gem/a279782b34da?usp=sharing"}', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 17:33:07.380984+00'),
	('097e3c2e-7d09-48bf-925c-c519d26c76bc', 'request_tasks', 'ca64dd3c-d93a-4b27-9584-994766822333', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "http://localhost:5173/colaborador"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-08 18:28:09.063308+00'),
	('aa417944-0660-4316-8cd3-3ea355b3a526', 'request_tasks', 'ca64dd3c-d93a-4b27-9584-994766822333', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "http://localhost:5173/colaborador"}', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 18:39:22.691621+00'),
	('2ba28ad8-3601-4deb-be4b-c7f48bf63fba', 'request_tasks', 'ca64dd3c-d93a-4b27-9584-994766822333', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "http://localhost:5173/colaborador"}', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 18:40:08.663064+00'),
	('85730331-c049-420f-bc38-9fddbcd74681', 'request_tasks', '59345e64-0091-489b-809a-6d572b68cef1', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://themewagon.github.io/podux/#"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-08 21:11:49.670623+00'),
	('62abd028-f654-4d3f-bfd3-ef40ece0cc8d', 'request_tasks', '59345e64-0091-489b-809a-6d572b68cef1', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://themewagon.github.io/podux/#"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-08 21:13:32.841587+00'),
	('f31802f7-34a2-49ed-a8eb-86b4adc5fa15', 'request_tasks', '59345e64-0091-489b-809a-6d572b68cef1', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://themewagon.github.io/podux/#"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-08 21:15:32.395922+00'),
	('75516c84-8e67-4c19-bc1d-6e5a05b10073', 'request_tasks', '59345e64-0091-489b-809a-6d572b68cef1', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://themewagon.github.io/podux/#"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-08 21:19:15.267175+00'),
	('e5e0534b-b612-45ba-9369-57513401501d', 'request_tasks', 'fad75dc6-2145-455d-aab4-21c631b9cb5a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://youtube.com"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-14 18:10:35.845511+00'),
	('7dca9503-290c-4bec-92e0-6edc9f9d2888', 'request_tasks', 'fad75dc6-2145-455d-aab4-21c631b9cb5a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://youtube.com"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-14 18:13:34.388176+00'),
	('c24e5bc5-4088-4af4-841c-78d7492f9c79', 'request_tasks', '63e13e87-fccd-469e-b2d0-d9c6fd3ff6ee', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://youtube.com"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-14 19:13:14.334233+00'),
	('91fa93b5-fa98-4b7b-92a2-71664b998ab7', 'request_tasks', 'd95e7195-2fb5-4645-b272-55c1e6e8c979', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-15 22:54:30.133441+00'),
	('8506c6a9-d77f-4f26-bf42-a76043cfcacc', 'request_tasks', 'd95e7195-2fb5-4645-b272-55c1e6e8c979', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-15 22:57:40.103526+00'),
	('4886f9e6-8fd1-4c50-8e9d-9a4f2cb957cf', 'request_tasks', '9598623e-a48e-4f7e-b716-cd17f2010d82', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Diseño", "deliverable_url": "https://trello.com/c/TdjAQqOd/230-pantallas-del-20-al-24-de-julio"}', '000ed70a-a668-4379-82c6-a82e7d523543', '2026-07-15 23:03:48.987166+00'),
	('66aadf5b-0e3c-4a2b-989d-349b74c3c625', 'request_tasks', 'd95e7195-2fb5-4645-b272-55c1e6e8c979', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-15 23:17:57.894886+00'),
	('d0460858-b73d-4f73-9f19-de494388e756', 'request_tasks', 'd95e7195-2fb5-4645-b272-55c1e6e8c979', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-15 23:25:08.37788+00'),
	('ce4e3268-1c26-40f7-9a64-dc7a4d363153', 'request_tasks', 'f97d4f2f-c75b-46ea-8f8d-23d57039df5b', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-15 23:33:34.292476+00'),
	('cad306e6-828f-459c-83b5-928b55abd469', 'request_tasks', 'ec1c467a-54fc-4415-952c-6627850fdc11', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-15 23:36:37.639453+00'),
	('4a5939ce-9325-4c13-a617-a6804cb08ec8', 'request_tasks', '6f8c3101-d259-4392-af34-7d7e5791c955', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Diseño", "deliverable_url": "https://trello.com/c/y174BMZZ/286-narrativa-ajuste"}', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', '2026-07-15 23:53:24.537457+00'),
	('e5cee86e-4ff3-4bb0-a1dc-d97f20ffc2b2', 'request_tasks', 'f97d4f2f-c75b-46ea-8f8d-23d57039df5b', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-15 23:56:18.890515+00'),
	('517be09b-2419-4ba1-8883-13947b128503', 'request_tasks', 'ecc98c33-5f15-4f52-97c3-a9960b94918d', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:08:45.717792+00'),
	('bff844e2-8b8c-4e21-af0b-1ae5491c88a7', 'request_tasks', 'ecc98c33-5f15-4f52-97c3-a9960b94918d', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:09:26.33482+00'),
	('e76fcedf-ac9b-41fc-8929-3f017a21779a', 'request_tasks', '246b1bb3-27d0-42e7-866c-288e5844214a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://wolverineworldwide.com/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:14:54.454556+00'),
	('a26faf15-d51c-4407-9e3a-d44d5ad9e818', 'request_tasks', '246b1bb3-27d0-42e7-866c-288e5844214a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://wolverineworldwide.com/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:15:41.961801+00'),
	('894d9019-e0e9-49dd-a068-7bfa06182a37', 'request_tasks', 'f97d4f2f-c75b-46ea-8f8d-23d57039df5b', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://www.letras.com/the-beatles/182/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:18:08.950989+00'),
	('b7eac21d-bb53-4631-93d6-14deef9e8738', 'request_tasks', '246b1bb3-27d0-42e7-866c-288e5844214a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://wolverineworldwide.com/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:22:37.646656+00'),
	('02a35aa7-ae6e-45ed-a7d3-44a69ebb32ea', 'request_tasks', '246b1bb3-27d0-42e7-866c-288e5844214a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://wolverineworldwide.com/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:32:26.532808+00'),
	('baa3c436-1783-4a19-ab47-034df151db6e', 'request_tasks', '246b1bb3-27d0-42e7-866c-288e5844214a', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Programación", "deliverable_url": "https://wolverineworldwide.com/"}', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-16 00:33:12.118378+00'),
	('907e1701-3fc9-43c4-be5d-557f12d47b8f', 'request_tasks', 'a3868554-3f75-4462-b52a-dc27c2710c24', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Diseño", "deliverable_url": "https://trello.com/c/I5pTvJH2/51-comunicaci%C3%B3n-ganadores-reto-gofluent"}', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-20 15:33:39.819396+00'),
	('d467ac11-d7d2-4d60-9d61-cdd86c0a20ba', 'request_tasks', 'bf40462b-f659-4260-9f05-88010ff824ac', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Diseño", "deliverable_url": "https://trello.com/c/Y2ql52D2/50-plantilla-sesiones-de-salud-y-vida"}', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-20 15:34:01.868458+00'),
	('f6d933cc-2282-4754-9131-b6ce20165255', 'request_tasks', '59a2800a-b7ba-48fe-b95d-4439a2ee70b9', 'TASK_SUBMITTED', NULL, '{"status": "entregado", "discipline": "Diseño", "deliverable_url": "https://trello.com/c/9sIu7t5T/766-chivapuertas-nike"}', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-20 15:34:19.170394+00');


--
-- Data for Name: file_extensions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."file_extensions" ("id", "extension") VALUES
	(1, '.mp4'),
	(2, '.mov'),
	(3, '.png'),
	(4, '.jpg'),
	(5, '.pdf'),
	(6, 'HTML'),
	(7, 'PPT'),
	(8, 'Word'),
	(9, 'MP4'),
	(10, 'JPG'),
	(11, 'PNG'),
	(13, 'PDF'),
	(14, 'PPTX'),
	(15, 'DOCX'),
	(16, 'STICKERS'),
	(18, 'MOV'),
	(19, 'GIF'),
	(21, 'QR'),
	(22, 'SHAREPOINT'),
	(23, 'WORKVIVO'),
	(24, 'MAILCHIMP'),
	(25, 'ELOQUA'),
	(26, 'KEYNOTE');


--
-- Data for Name: request_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."request_categories" ("id", "name") VALUES
	(1, 'Video'),
	(3, 'Documento'),
	(5, 'Presentación Corporativa'),
	(6, 'Redacción / Copywriting'),
	(8, 'Diseño Gráfico'),
	(12, 'Animación'),
	(13, 'Web'),
	(14, 'Impresión'),
	(17, 'Estrategia');


--
-- Data for Name: category_allowed_formats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category_allowed_formats" ("category_id", "format_id") VALUES
	(1, 1),
	(1, 2),
	(3, 5),
	(5, 7),
	(6, 8),
	(8, 10),
	(8, 11),
	(8, 13),
	(8, 14),
	(8, 15),
	(8, 16),
	(1, 9),
	(1, 18),
	(1, 19),
	(12, 9),
	(12, 18),
	(12, 19),
	(13, 6),
	(13, 21),
	(13, 22),
	(13, 23),
	(13, 24),
	(13, 25),
	(14, 13),
	(3, 13),
	(3, 15),
	(6, 13),
	(6, 15),
	(17, 13),
	(17, 14),
	(5, 14),
	(5, 26);


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "created_at", "profile_id", "title", "message", "action_link", "is_read", "type") VALUES
	('76082d0f-1ac7-47ef-b62d-f5c73f8b12a6', '2026-07-15 19:25:44.716208+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🚀 ¡Prueba Exitosa!', 'Si estás leyendo esto, tu sistema de notificaciones en tiempo real funciona al 100%.', NULL, true, 'success'),
	('1de614b0-69a5-41fe-9669-59ded2776ba6', '2026-07-15 19:26:02.889795+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🚀 ¡Prueba Exitosa!', 'Si estás leyendo esto, tu sistema de notificaciones en tiempo real funciona al 100%.', NULL, true, 'success'),
	('5011f369-1e55-4f77-aa5f-598910925dc3', '2026-07-15 19:26:25.24201+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🚀 ¡Prueba Exitosa!', 'Si estás leyendo esto, tu sistema de notificaciones en tiempo real funciona al 100%.', NULL, true, 'success'),
	('d30e0efb-4627-49e7-8e6d-abac0f3ece90', '2026-07-15 19:26:27.174337+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🚀 ¡Prueba Exitosa!', 'Si estás leyendo esto, tu sistema de notificaciones en tiempo real funciona al 100%.', NULL, true, 'success'),
	('96ca02e2-9101-442d-b0e5-2772fe55d5e5', '2026-07-15 19:26:28.186373+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🚀 ¡Prueba Exitosa!', 'Si estás leyendo esto, tu sistema de notificaciones en tiempo real funciona al 100%.', NULL, true, 'success'),
	('89694141-f08d-4ecc-8623-244149da1789', '2026-07-15 19:26:29.373407+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🚀 ¡Prueba Exitosa!', 'Si estás leyendo esto, tu sistema de notificaciones en tiempo real funciona al 100%.', NULL, true, 'success'),
	('e5a85c2c-6d0a-4498-98b2-b124a0ec3d85', '2026-07-15 19:27:34.116167+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🚀 ¡Prueba Exitosa!', 'Si estás leyendo esto, tu sistema de notificaciones en tiempo real funciona al 100%.', NULL, true, 'success'),
	('38b44aad-0147-499d-829b-f6af4d6b6182', '2026-07-15 20:52:59.194939+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', '🔥 Nueva Solicitud Global', 'Tolko ha ingresado el ticket: asdasdasdasdasdasd', '#dashboard', false, 'info'),
	('06fdb06a-e503-4a9c-9874-ae768a7cc547', '2026-07-15 20:52:59.194939+00', '6901712f-b020-4eec-83eb-13d1eff277c0', '🔥 Nueva Solicitud Global', 'Tolko ha ingresado el ticket: asdasdasdasdasdasd', '#dashboard', false, 'info'),
	('12646fdc-a9b5-46d0-8867-c1e2ba5bbf70', '2026-07-15 20:52:59.194939+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '🔥 Nueva Solicitud Global', 'Tolko ha ingresado el ticket: asdasdasdasdasdasd', '#dashboard', false, 'info'),
	('297ae7dd-ab92-49ce-ae18-138690c19f56', '2026-07-15 20:52:59.194939+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🔥 Nueva Solicitud Global', 'Tolko ha ingresado el ticket: asdasdasdasdasdasd', '#dashboard', true, 'info'),
	('b8d2f249-660d-4136-a11a-752a91852efc', '2026-07-15 20:49:31.581866+00', '2072a09e-3804-447f-a7f5-efacc0589e83', '📌 Nueva Tarea Asignada', 'Se te asignó la pieza de RP para el proyecto: Newsletter semanal ', '#dashboard', true, 'info'),
	('eb392283-a16b-4e2c-a570-89fdd21772ad', '2026-07-15 21:05:15.455978+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdsdasdas', '#dashboard', false, 'info'),
	('975f5e51-162b-4468-b470-0aedb7ca7eb3', '2026-07-15 21:05:15.455978+00', '6901712f-b020-4eec-83eb-13d1eff277c0', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdsdasdas', '#dashboard', false, 'info'),
	('e28c5052-fa5d-46d8-9635-2fb34610c8e5', '2026-07-15 21:05:15.455978+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdsdasdas', '#dashboard', false, 'info'),
	('e21a0662-9007-420d-90fe-815a75249446', '2026-07-15 21:05:15.455978+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdsdasdas', '#dashboard', true, 'info'),
	('87be8f20-c5c9-47e9-98c4-d7e5c6a9d198', '2026-07-15 21:05:46.644286+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '📌 Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: asdasdasdasdasdasd', '#dashboard', true, 'info'),
	('381f5b4c-d667-4866-87e9-7be39a0efd94', '2026-07-15 21:18:44.315993+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '⚠️ Ajustes Requeridos', 'Revisión solicitada en Diseño para: ADT PARTICIPANTES BIBS', '#dashboard', false, 'alert'),
	('65ae3db3-de5d-48e7-92fa-5632c72043cd', '2026-07-15 22:52:12.678163+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: sdsfs', '#dashboard', false, 'info'),
	('6bed7454-4f4e-43ba-87a7-cb250b9da829', '2026-07-15 22:52:12.678163+00', '6901712f-b020-4eec-83eb-13d1eff277c0', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: sdsfs', '#dashboard', false, 'info'),
	('50006ae2-f72c-4037-baec-2594c17a26b7', '2026-07-15 22:52:12.678163+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: sdsfs', '#dashboard', false, 'info'),
	('a83da601-0228-4bc8-9468-73e8b2b2aaca', '2026-07-15 22:52:12.678163+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '🔥 Nueva Solicitud Global', 'Tolko ingresó el ticket: sdsfs', '#dashboard', true, 'info'),
	('6a539453-180b-4b4d-b9d4-9df4ff900ca1', '2026-07-15 22:53:38.541301+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '🚨 Tu área fue agregada al proyecto', 'Se activó tu célula en el ticket: dasdsdasdas', '#solicitudes', false, 'alert'),
	('3f4c8263-36f3-4c2f-adcc-2e53c3a20f1b', '2026-07-15 22:56:29.345541+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '⚠️ Ajustes Requeridos', 'Revisión solicitada en Programación para: asdasdasdasdasdasd', '#dashboard', true, 'alert'),
	('aa9f977a-b65c-4c9d-abcd-cfb91f9fd69e', '2026-07-15 22:53:38.986151+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '📌 Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: dasdsdasdas', '#dashboard', true, 'info'),
	('52717d79-9621-40be-8db1-8634bbff5fd1', '2026-07-15 23:25:08.050084+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', '✅ Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para el proyecto: asdasdasdasdasdasd', '#solicitudes', false, 'success'),
	('b1e0b650-3e78-49a3-815a-c16d0c77045f', '2026-07-15 23:25:08.050084+00', '6901712f-b020-4eec-83eb-13d1eff277c0', '✅ Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para el proyecto: asdasdasdasdasdasd', '#solicitudes', false, 'success'),
	('fe6f537a-b712-480b-a016-cdfef1708bee', '2026-07-15 23:25:08.050084+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '✅ Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para el proyecto: asdasdasdasdasdasd', '#solicitudes', false, 'success'),
	('b7d252bf-9171-4ddf-956c-4aaf51cb5c79', '2026-07-15 23:24:54.824825+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '⚠️ Ajustes Requeridos', 'Revisión solicitada en Programación para: asdasdasdasdasdasd', '#dashboard', true, 'alert'),
	('c4273a00-7ca3-4b51-8486-c166195626da', '2026-07-15 22:53:38.541301+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', '🚨 Tu área fue agregada al proyecto', 'Se activó tu célula en el ticket: dasdsdasdas', '#solicitudes', true, 'alert'),
	('f7753104-ab7e-4443-8c2f-6e2f078fdfe7', '2026-07-15 23:16:03.792671+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '⚠️ Ajustes Requeridos', 'Revisión solicitada en Programación para: asdasdasdasdasdasd', '#dashboard', true, 'alert'),
	('bebabd31-399c-4f03-a902-a15c0446f7a9', '2026-07-15 23:25:08.050084+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '✅ Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para el proyecto: asdasdasdasdasdasd', '#solicitudes', true, 'success'),
	('d5ec5e4f-025c-4c03-87a4-1381a445e1c6', '2026-07-15 23:25:08.050084+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '✅ Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para el proyecto: asdasdasdasdasdasd', '#solicitudes', false, 'success'),
	('ce6de69f-937f-4f52-b324-53f000c637a7', '2026-07-15 23:25:08.050084+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', '✅ Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para el proyecto: asdasdasdasdasdasd', '#solicitudes', true, 'success'),
	('fcdd24c3-5486-401b-84a1-eabbd2d15a9e', '2026-07-15 23:29:35.560771+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: prueba bueno', '#dashboard', false, 'info'),
	('de56256d-3faf-49a9-a90e-240dfe8a7024', '2026-07-15 23:29:35.560771+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: prueba bueno', '#dashboard', false, 'info'),
	('ed730ea0-abd9-48cf-89c5-62bd46312346', '2026-07-15 23:29:35.560771+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: prueba bueno', '#dashboard', false, 'info'),
	('53f4ed5f-f3d5-4f6d-aab9-44db5d7c6bef', '2026-07-15 23:29:35.560771+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: prueba bueno', '#dashboard', true, 'info'),
	('e383fbb8-4fd3-4aad-9978-67f154a2aa16', '2026-07-15 23:30:31.190229+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: prueba bueno', '#solicitudes', false, 'alert'),
	('22057855-1e1f-4a4a-b0e3-4a216f1ba32e', '2026-07-15 23:30:31.190229+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: prueba bueno', '#solicitudes', true, 'alert'),
	('07dac5ca-c57c-4768-951b-99bad63eda01', '2026-07-15 23:33:13.069907+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: prueba bueno', '#dashboard', true, 'info'),
	('f737c935-3f0d-44f9-84e9-3e6791000b63', '2026-07-15 23:33:33.873091+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '#solicitudes', false, 'success'),
	('6c83927e-2187-4f5b-a370-afc0f91e7187', '2026-07-15 23:36:37.379281+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: dasdsdasdas', '#solicitudes', false, 'success'),
	('406be2eb-f38f-42d8-8a7e-c0b648232950', '2026-07-15 23:53:24.139109+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Narrativa', '?ticket=c09acacf-b590-406a-9c82-4d192a98baa4', false, 'success'),
	('6b6a9df4-1a26-4002-b310-bf2a63ffca75', '2026-07-15 23:53:24.139109+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Narrativa', '?ticket=c09acacf-b590-406a-9c82-4d192a98baa4', false, 'success'),
	('ab7af00e-04d9-4a6e-8469-ab36bb6f3b60', '2026-07-15 23:53:24.139109+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Narrativa', '?ticket=c09acacf-b590-406a-9c82-4d192a98baa4', false, 'success'),
	('f0851f68-39fc-4f97-8459-775e8f976099', '2026-07-15 23:56:18.624868+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '?ticket=c31b8af4-c428-4b32-b5c9-fe0d3925737e', false, 'success'),
	('f160cb3e-13bf-40a6-afc3-456f692bc32e', '2026-07-15 23:33:33.873091+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '#solicitudes', true, 'success'),
	('aba57af6-ba15-4a38-904d-c1e0960616fc', '2026-07-15 23:36:37.379281+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: dasdsdasdas', '#solicitudes', true, 'success'),
	('21c56df6-af91-4579-aa73-388086cf571b', '2026-07-15 23:56:18.624868+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '?ticket=c31b8af4-c428-4b32-b5c9-fe0d3925737e', true, 'success'),
	('0abae8c8-ee31-45cf-b04b-b0f999fd02bb', '2026-07-16 00:07:37.086919+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', false, 'info'),
	('6be4a59f-de97-4828-8d23-961d2438dfbe', '2026-07-16 00:07:37.086919+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', false, 'info'),
	('96bfcaff-ec01-4268-8d15-55b4accbeecc', '2026-07-16 00:07:37.086919+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', false, 'info'),
	('641da1f2-b5cd-43a5-ae33-7edcded5802f', '2026-07-16 00:08:12.372031+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', false, 'alert'),
	('35be1516-02b1-41d2-bd44-4705c996348c', '2026-07-16 00:08:45.355588+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', false, 'success'),
	('c18a9d20-fb7e-45be-b553-ed37874bda31', '2026-07-16 00:09:26.098331+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', false, 'success'),
	('d30aeb42-2efe-44d5-9b88-55645f3f677c', '2026-07-15 23:56:05.326974+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: prueba bueno', '?task=f97d4f2f-c75b-46ea-8f8d-23d57039df5b', true, 'alert'),
	('930823f9-7501-427b-aa4e-323a312b9d94', '2026-07-16 00:08:32.837279+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno bueno', '?task=ecc98c33-5f15-4f52-97c3-a9960b94918d', true, 'info'),
	('b8759fbf-cc08-4cb6-a7c9-4e8aaec39721', '2026-07-16 00:09:19.956641+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno bueno', '?task=ecc98c33-5f15-4f52-97c3-a9960b94918d', true, 'alert'),
	('1a464e79-0641-40c7-bcb4-e50f5ee44862', '2026-07-16 00:07:37.086919+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', true, 'info'),
	('2648b606-a2df-49c4-864a-813cecf49726', '2026-07-16 00:08:12.372031+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', true, 'alert'),
	('d71f1b7f-a874-4e46-b1d5-853360c6eef7', '2026-07-16 00:08:45.355588+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', true, 'success'),
	('79047891-c46d-42e5-a524-936053f531f8', '2026-07-16 00:09:26.098331+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', true, 'success'),
	('d8caabed-502a-4fa7-8362-f18c9135e767', '2026-07-16 00:13:18.558604+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'info'),
	('c88a782c-9f14-45be-ba7e-30102bd145a4', '2026-07-16 00:13:18.558604+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'info'),
	('4136d817-736c-45e5-bd22-cc4f43d5da11', '2026-07-16 00:13:18.558604+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'info'),
	('04423f9e-ad3e-4501-82c2-7c981c3fc4a2', '2026-07-16 00:13:39.949241+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'alert'),
	('0a050f36-8e98-447e-9205-62d6b6ee6a4d', '2026-07-16 00:14:54.049027+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'success'),
	('6a26d145-0daa-4f0d-9ea0-192c3ed3fbad', '2026-07-16 00:13:39.949241+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'alert'),
	('2f3c5a24-ed0d-450b-8130-b0ac1273c3b7', '2026-07-16 00:14:54.049027+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'success'),
	('443f6a66-1497-4bd1-bd84-f28ca3b164ae', '2026-07-16 00:13:18.558604+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'info'),
	('7fa157d1-6c43-451c-a8f7-46d804bc1827', '2026-07-16 00:15:41.702906+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'success'),
	('4ef43ab6-4ffe-4b21-9635-78bc2ece9c08', '2026-07-16 00:15:41.702906+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'success'),
	('74aef9b6-85b4-4134-83fc-a80487c260d6', '2026-07-16 00:16:58.492524+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '?ticket=c31b8af4-c428-4b32-b5c9-fe0d3925737e', false, 'success'),
	('e3262b75-4325-4903-a923-7182bfbdbfad', '2026-07-16 00:18:08.591908+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '?ticket=c31b8af4-c428-4b32-b5c9-fe0d3925737e', false, 'success'),
	('91c9563f-fc04-4c99-bbee-e14578e59129', '2026-07-16 00:22:37.338744+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'success'),
	('2d968aaa-ae96-4887-a30b-44043dcf2aa5', '2026-07-16 00:13:55.679129+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('f801047f-8ba5-47f0-9479-d8e234c1280d', '2026-07-16 00:15:18.188267+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'alert'),
	('50734241-1cc7-4463-883e-db86cc1bb688', '2026-07-16 00:17:30.883316+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: prueba bueno', '?task=f97d4f2f-c75b-46ea-8f8d-23d57039df5b', true, 'alert'),
	('94fa3efe-d072-4a21-aa0f-8260821ca5f4', '2026-07-16 00:22:14.425192+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'alert'),
	('8a3cd085-7cc6-405a-8ce2-b9db0898605a', '2026-07-16 00:22:19.624378+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('4341f730-1c42-413b-8d4b-32cc697c9032', '2026-07-16 00:16:58.492524+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '?ticket=c31b8af4-c428-4b32-b5c9-fe0d3925737e', true, 'success'),
	('7f8d9612-b269-43ec-9d80-d7fe4ab4f505', '2026-07-16 00:18:08.591908+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: prueba bueno', '?ticket=c31b8af4-c428-4b32-b5c9-fe0d3925737e', true, 'success'),
	('8f8cd647-9f5f-4b02-ad6e-4d89e089c1f4', '2026-07-16 00:22:37.338744+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'success'),
	('303daa02-6934-4de5-a990-54601145c0f3', '2026-07-16 00:32:26.172374+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'success'),
	('d1a4c6d7-094a-4c79-aeed-83e0599b2103', '2026-07-16 00:33:11.851257+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'success'),
	('a28d89c1-5a9e-4a7c-a62f-0c16af102070', '2026-07-16 00:32:26.172374+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'success'),
	('d3fba6a1-b11a-4af5-a864-099999b4799b', '2026-07-16 00:33:11.851257+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'success'),
	('7db4bda6-7e82-4697-9b6f-86c9d2de0158', '2026-07-16 00:34:56.999415+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'alert'),
	('f68c83a0-3d93-48c0-acc7-05cd80a4ae24', '2026-07-16 00:34:56.999415+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'alert'),
	('230fa5e3-d172-4f3d-969e-44e10f4dba38', '2026-07-16 00:34:56.999415+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'alert'),
	('ca8bf787-f9c9-4421-b214-07b198366f3e', '2026-07-16 00:35:48.137521+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Prueba bueno 3', '?task=68a49bf7-5729-4d10-afc3-4178642c125b', false, 'info'),
	('863f238a-011c-45a3-a1d0-9c773272d415', '2026-07-16 00:25:00.845518+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'alert'),
	('6115072c-50f1-4898-93eb-3bf447508dfd', '2026-07-16 00:26:28.519972+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno bueno', '?task=ecc98c33-5f15-4f52-97c3-a9960b94918d', true, 'alert'),
	('8fee7f37-7d02-49c1-b4b1-dfaa230eae9c', '2026-07-16 00:32:39.131051+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'alert'),
	('01e436cf-73ce-4884-aeac-5e46be5a541e', '2026-07-16 00:33:23.627486+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'alert'),
	('385f0213-cfbc-4243-ac34-ec5e08571f01', '2026-07-16 00:34:57.655791+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('eeabd99d-4120-457f-ae77-794cfcdcb794', '2026-07-16 00:34:56.999415+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'alert'),
	('8160b5fb-3b54-4c44-b141-7419a959fd2a', '2026-07-16 00:35:48.479695+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('d7cdf564-ecdd-410d-a9ec-5a6d7ba4ac91', '2026-07-16 00:58:23.934819+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Newsletter semanal ', '?task=be0eb86c-c377-4c81-a0ba-b198fdff3751', false, 'info'),
	('67a45c2c-3f29-4ddb-9f00-94baafe738c0', '2026-07-16 01:01:24.42858+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Invitación examen Go Fluent', '?task=af63d58d-be30-4d0a-bb80-b4fc5c8dfa92', false, 'info'),
	('efa4fa20-bbaf-4b55-b2e8-2566c9df07bc', '2026-07-16 01:01:24.814191+00', '897e2dd9-2646-4d9e-a20d-f40da228e85e', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Invitación examen Go Fluent', '?task=ebfebb2e-4f34-464a-8c80-b229a65a2223', false, 'info'),
	('715baca7-cac5-4f87-8758-1caf164582c1', '2026-07-16 01:01:53.477082+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Invitación examen Go Fluent', '?task=af63d58d-be30-4d0a-bb80-b4fc5c8dfa92', false, 'info'),
	('c968ad2d-58ef-40ea-9a34-741b3c453a94', '2026-07-16 01:01:53.795874+00', '897e2dd9-2646-4d9e-a20d-f40da228e85e', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Invitación examen Go Fluent', '?task=ebfebb2e-4f34-464a-8c80-b229a65a2223', false, 'info'),
	('2b1f92c5-f65d-479b-a056-25f1e9277eeb', '2026-07-16 01:04:18.611626+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Newsletter semanal ', '?ticket=d9afdbee-a381-49b5-8891-865e8048df42', false, 'success'),
	('14af2dd8-21ef-4826-8949-609a412449aa', '2026-07-16 01:08:46.732579+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Newsletter semanal ', '?ticket=d9afdbee-a381-49b5-8891-865e8048df42', false, 'success'),
	('149d2f96-bd69-4e93-af5a-aae21a8f2a53', '2026-07-16 01:08:46.732579+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Newsletter semanal ', '?ticket=d9afdbee-a381-49b5-8891-865e8048df42', false, 'success'),
	('8cca45a7-6da8-48b9-aa4a-7313532fa446', '2026-07-16 01:08:46.732579+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Newsletter semanal ', '?ticket=d9afdbee-a381-49b5-8891-865e8048df42', false, 'success'),
	('f8e26083-f2d1-475a-922c-01d5804be0d2', '2026-07-16 01:10:40.235309+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'success'),
	('886ced5a-10e5-4e70-a9fa-b26e3fd1c2c2', '2026-07-16 01:10:45.773165+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Prueba bueno 3', '?task=68a49bf7-5729-4d10-afc3-4178642c125b', false, 'info'),
	('ace52356-a168-487a-8304-e635eac04b48', '2026-07-16 01:10:54.53014+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', false, 'success'),
	('417fd860-7e83-42ab-9863-58b9ba387486', '2026-07-16 01:12:22.144689+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Newsletter semanal ', '?task=be0eb86c-c377-4c81-a0ba-b198fdff3751', false, 'info'),
	('eb1ae466-6f4c-416e-9b8f-c0ba6f497fdf', '2026-07-16 01:22:06.53022+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'BIOPAPPEL ingresó el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'info'),
	('153b308d-730a-4731-ba7c-0fa8333d1cdf', '2026-07-16 01:22:06.53022+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'BIOPAPPEL ingresó el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'info'),
	('6e8718c6-d113-4fbc-b812-c4efd06f699c', '2026-07-16 01:22:06.53022+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'BIOPAPPEL ingresó el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'info'),
	('b95c530a-8c6c-41f1-a4d9-97db3388dd99', '2026-07-16 01:23:35.070973+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'alert'),
	('a3c0ca00-305d-4a1b-9217-d23dbf41a336', '2026-07-16 01:23:35.070973+00', '473016e7-f5e4-451e-a889-8d19a11484f2', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'alert'),
	('59b94a82-9ca9-48f0-81dd-cc575f9888f2', '2026-07-16 01:23:35.070973+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'alert'),
	('51a2007b-2bcb-4060-ab83-e3772a58002e', '2026-07-16 01:23:35.070973+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'alert'),
	('744c6428-6707-468b-81df-dcedc5a67014', '2026-07-16 01:23:35.936338+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Visualización del micrositio ', '?task=04cb96e5-5687-4561-b587-bbaca34b9e5e', false, 'info'),
	('7fa1db9c-78e4-467b-9983-afc2329cbbac', '2026-07-16 02:18:14.316434+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'alert'),
	('5c72bdd5-c90c-4de3-b5f6-eb96b64e1f76', '2026-07-16 02:18:14.316434+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'alert'),
	('4dce83ee-a2db-4633-9b54-2947fbcae867', '2026-07-16 02:18:14.316434+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'alert'),
	('2e7c2031-f345-47c6-989f-24807edcedcf', '2026-07-16 02:18:15.336216+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Visualización del micrositio ', '?task=04cb96e5-5687-4561-b587-bbaca34b9e5e', false, 'info'),
	('ebcb3e2e-d9e2-40ca-bd62-ca46cf4739dd', '2026-07-16 16:15:46.623526+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Prueba bueno 3', '?task=68a49bf7-5729-4d10-afc3-4178642c125b', false, 'info'),
	('2fa81b24-ebda-46bd-a517-1902a8ff7ac7', '2026-07-16 16:16:32.841175+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Prueba bueno 3', '?task=68a49bf7-5729-4d10-afc3-4178642c125b', false, 'info'),
	('18f61482-4b36-4e29-95ca-cf32ae7ac3f7', '2026-07-16 01:08:46.732579+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Newsletter semanal ', '?ticket=d9afdbee-a381-49b5-8891-865e8048df42', true, 'success'),
	('b1148d1d-4926-4405-bab1-bca0e6f53c65', '2026-07-16 02:18:14.316434+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', true, 'alert'),
	('a523137e-32dd-4ed1-b85a-5491ca9eef25', '2026-07-16 01:22:06.53022+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'BIOPAPPEL ingresó el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', true, 'info'),
	('971d64f4-6c9b-478a-a621-af08a3d08a43', '2026-07-16 01:10:46.127196+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('535a997b-ec63-44b7-8fdd-cb6b5bdd3a1b', '2026-07-16 16:16:48.87984+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', false, 'success'),
	('61c730c0-4ae4-4238-b509-1be2560aaf36', '2026-07-16 16:16:33.507404+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('fbd313f7-192e-4e72-9406-1796d54a5eb0', '2026-07-16 16:16:48.87984+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'success'),
	('4b3eb38c-02e4-46cc-a379-80defdac3b69', '2026-07-16 17:21:47.947794+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', false, 'alert'),
	('5ae199cd-741f-4a41-8431-b8366ba5b0c9', '2026-07-16 17:21:47.947794+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', false, 'alert'),
	('a4964fc8-46da-4779-819c-66be33f319bc', '2026-07-16 17:21:47.947794+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', false, 'alert'),
	('cd64d337-3c16-4282-90a7-d924087a2336', '2026-07-16 17:21:49.054343+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Pantallas Tip 5s julio', '?task=e1353bac-7022-45c8-9e46-230e018085a9', false, 'info'),
	('d81926f2-1017-4369-9209-682ac39a67c4', '2026-07-16 17:22:51.300683+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Pantallas Tip 5s julio', '?task=e1353bac-7022-45c8-9e46-230e018085a9', false, 'info'),
	('61eb0327-e964-4bb1-814f-4e81a06ada5b', '2026-07-16 17:23:02.823331+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: sdsfs', '?ticket=d5f62767-8a7e-42e4-a0a6-8fa987d7c1df', false, 'alert'),
	('9ff46e0a-4840-450f-94f8-d70d159eb985', '2026-07-16 17:23:23.590101+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Pantallas Tip 5s julio', '?task=e1353bac-7022-45c8-9e46-230e018085a9', false, 'info'),
	('6cce5357-de90-43d9-aaab-f93e7aa49139', '2026-07-16 17:34:12.612489+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'info'),
	('0a7cbe04-d711-43e8-b7d0-ee7f3f258586', '2026-07-16 17:34:12.612489+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'info'),
	('ef4eff9b-48ac-4c62-81c5-54349e267b5f', '2026-07-16 17:34:12.612489+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'info'),
	('03b10e52-b2a9-4787-8a8e-3b6c69a138cc', '2026-07-16 17:35:20.138586+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'alert'),
	('5c67b7c9-292c-4b0d-a336-9e79516250c7', '2026-07-16 17:35:20.138586+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'alert'),
	('536d8276-db1f-4e66-b2d6-1c6edf586554', '2026-07-16 17:35:20.138586+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'alert'),
	('9bc1ec49-9039-46da-9e94-fb9e4e5cd3aa', '2026-07-16 17:35:20.138586+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'alert'),
	('4ae769a3-40aa-4d22-9631-4b3e627c62b8', '2026-07-16 17:35:20.138586+00', '473016e7-f5e4-451e-a889-8d19a11484f2', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'alert'),
	('0c316318-595b-4637-958d-ac97efb587a9', '2026-07-16 17:35:20.138586+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', false, 'alert'),
	('51b35a63-6a5e-4788-ba4a-4cbcce98e737', '2026-07-16 17:35:20.786046+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Logotipo AMS', '?task=509237fc-97aa-41e7-a4b1-7865bda4466e', false, 'info'),
	('090e4c39-ad2e-468a-b918-bd0dee8a081a', '2026-07-16 17:41:09.755491+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Visualización del micrositio ', '?task=04cb96e5-5687-4561-b587-bbaca34b9e5e', false, 'info'),
	('45b92991-b277-4fd1-8d1b-087f79ba61ee', '2026-07-16 17:58:43.404987+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Visualización del micrositio ', '?task=04cb96e5-5687-4561-b587-bbaca34b9e5e', false, 'info'),
	('e52e3859-04aa-457e-9f84-759d989b3702', '2026-07-16 01:04:18.611626+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Newsletter semanal ', '?ticket=d9afdbee-a381-49b5-8891-865e8048df42', true, 'success'),
	('05cd1d4f-4c3d-4662-aa6e-41ef365e7db2', '2026-07-16 01:10:40.235309+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno 3', '?ticket=17857894-2a95-42b7-9993-348bc3e34634', true, 'success'),
	('d43d64c5-3840-49fb-828b-31d4af74fbe8', '2026-07-16 01:10:54.53014+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba bueno bueno', '?ticket=a6be8055-3bce-4c57-b31e-677103c2f61e', true, 'success'),
	('dd5d97d3-6864-4474-b597-7b4e622e9cdb', '2026-07-16 01:23:35.070973+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', true, 'alert'),
	('46ae5a15-0b2b-4b19-b62d-97a72d5929ff', '2026-07-16 16:15:47.097437+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('4d393b21-b977-4e23-9b98-c01618718804', '2026-07-16 16:16:29.473511+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Ajustes Requeridos', 'Revisión solicitada en Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'alert'),
	('87a84931-4363-4a77-8300-b81176c1b5fa', '2026-07-16 16:16:57.673858+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('fb615327-50ba-4bc0-9b8e-e878c5d0fa37', '2026-07-16 17:23:02.823331+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: sdsfs', '?ticket=d5f62767-8a7e-42e4-a0a6-8fa987d7c1df', true, 'alert'),
	('e7c24b5d-5112-4e57-89d6-c79efb05960d', '2026-07-16 17:23:03.354776+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: sdsfs', '?task=69a12da9-023a-44de-bc1b-d7b977d02397', true, 'info'),
	('2616e3f8-92c7-4a0f-92e8-26a4e7440987', '2026-07-16 17:23:41.817457+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('886335b5-96a4-490e-8899-767a88ed79e6', '2026-07-16 17:33:21.277642+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba bueno 3', '?task=246b1bb3-27d0-42e7-866c-288e5844214a', true, 'info'),
	('c3ac9e8d-69c1-4ca4-bfbf-5be8ad72b63d', '2026-07-16 19:00:44.828276+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'info'),
	('7804d5b3-da18-4d75-8ce4-3f6b88dcba22', '2026-07-16 19:00:44.828276+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'info'),
	('c17f59ff-19f1-43f8-81d4-e2ec7a47e6ac', '2026-07-16 19:00:44.828276+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'info'),
	('5257fc9c-77d7-4c2a-8e2d-21166911b785', '2026-07-16 19:01:53.840085+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'alert'),
	('275ff4ef-1700-4d05-9db3-95a3f82e2cb0', '2026-07-16 19:01:53.840085+00', '473016e7-f5e4-451e-a889-8d19a11484f2', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'alert'),
	('192775f2-1642-4a2a-bd67-0e58f3733fcc', '2026-07-16 17:34:12.612489+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Logotipo AMS', '?ticket=ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', true, 'info'),
	('1775bea1-5f5b-4744-a60f-8d8c7a514c41', '2026-07-16 19:01:53.840085+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', true, 'alert'),
	('bf6efba7-3d1f-4b59-a16e-2e2c24052165', '2026-07-16 19:01:53.840085+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'alert'),
	('73245bfb-2dc5-4528-b5ba-99d47e5625a2', '2026-07-16 19:01:53.840085+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'alert'),
	('e093204a-baa3-479f-9953-35f1a3dd382f', '2026-07-16 19:01:54.76653+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Actualizar base de datos para envío de newsletter', '?task=0c041f1b-c7f9-4cbc-b892-83fbeabc9c93', false, 'info'),
	('9878ddc1-7ec6-438e-8177-ed9690b8df04', '2026-07-16 19:19:41.555857+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', false, 'alert'),
	('76763d4e-9383-4e0c-a2d5-6e22fcab9888', '2026-07-16 19:19:41.555857+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', false, 'alert'),
	('c9c4eada-bbe9-4223-a9ea-f04e7a6c585c', '2026-07-16 19:19:41.555857+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', false, 'alert'),
	('37a161f9-792e-4913-9119-acb070a29e61', '2026-07-16 19:19:42.309846+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Invitación examen Go Fluent', '?task=1f55cb90-7b46-4e16-8e18-29ac3799114f', false, 'info'),
	('4629ecc2-bd15-43b8-87bb-8ec9fcae0c4b', '2026-07-16 19:19:58.476225+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', false, 'alert'),
	('f28415b2-f0e1-4672-af55-de9abc859268', '2026-07-16 19:19:58.476225+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', false, 'alert'),
	('ac4e56fc-f692-4f88-8ec6-146eb09e59f3', '2026-07-16 19:19:58.476225+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', false, 'alert'),
	('1e0c89d3-f0c1-4616-ae20-c71f66ebc116', '2026-07-16 19:19:59.147284+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Tips 5s julio', '?task=d4630e39-7639-4937-9cc8-642a9a4dcc86', false, 'info'),
	('a23639f2-6f0f-451f-991e-696d4a510257', '2026-07-16 17:21:47.947794+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', true, 'alert'),
	('b10d1ce3-3bb8-480c-b463-8c048e5a9fa9', '2026-07-16 19:19:41.555857+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', true, 'alert'),
	('5abab8f7-f7a4-41ba-b49a-72ff6e49075f', '2026-07-16 19:19:58.476225+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', true, 'alert'),
	('5c14c5d8-e5b0-4afc-bba7-d335ec399138', '2026-07-16 19:37:42.204499+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'NOVO NORDISK ingresó el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'info'),
	('aad96b7b-675b-465b-ba84-e4b29f27245d', '2026-07-16 19:37:42.204499+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'NOVO NORDISK ingresó el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'info'),
	('b1d48dc5-ed48-437e-922f-2142c37901ce', '2026-07-16 19:37:42.204499+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'NOVO NORDISK ingresó el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'info'),
	('7bfd576f-a27b-41f3-b967-6512d85c1d93', '2026-07-16 19:39:22.288739+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'alert'),
	('bb464e11-70b7-41a7-8b66-ac1d000a58a5', '2026-07-16 19:39:22.288739+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'alert'),
	('662e3d89-4a10-46a8-9aaf-20219c67a4c7', '2026-07-16 19:39:22.288739+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'alert'),
	('11229799-1891-4009-8c76-0ac08bbbf3ea', '2026-07-16 19:39:22.288739+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'alert'),
	('948783b1-d2c9-48ae-93a7-9a837ed5d210', '2026-07-16 19:39:22.288739+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'alert'),
	('795c785c-87de-4366-83a5-871c38b29330', '2026-07-16 19:39:22.288739+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'alert'),
	('d4d7c4e2-502e-4708-b07a-8dfa8efb9031', '2026-07-16 19:39:22.288739+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'alert'),
	('fde3c59a-66c4-43ac-a537-f5be53d9cd94', '2026-07-16 19:39:23.019288+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Comunicado Aviso External Support Analyst', '?task=29cff1de-eeb2-4a6a-ad8d-4ac452b15908', false, 'info'),
	('ba8e521d-8fe6-4ec8-97a9-50dd7c0104b2', '2026-07-16 19:39:47.229614+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Comunicado Aviso External Support Analyst', '?task=29cff1de-eeb2-4a6a-ad8d-4ac452b15908', false, 'info'),
	('7826a974-da54-4fdc-b16a-3347b07347dc', '2026-07-16 19:53:35.247677+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Comunicado Aviso External Support Analyst', '?task=a422f24d-c96d-411a-808b-3b328a555b6d', false, 'info'),
	('bb85c5f2-4405-4d17-b2d1-4b61a2b1cdf8', '2026-07-16 19:53:35.637816+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Comunicado Aviso External Support Analyst', '?task=29cff1de-eeb2-4a6a-ad8d-4ac452b15908', false, 'info'),
	('283c7b13-36d2-4928-8109-bf049a17ca39', '2026-07-16 20:00:49.118252+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'info'),
	('5ee7af09-eb42-4734-bc3c-a986259bf204', '2026-07-16 20:00:49.118252+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'info'),
	('f0c81b3c-12c9-4dfc-a997-b72ceb2e7850', '2026-07-16 20:00:49.118252+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'info'),
	('ac50f316-1c90-465d-bc17-b166bb2d0733', '2026-07-16 20:03:54.892445+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', false, 'info'),
	('aa976f73-def1-43aa-b433-2a8b8111fb61', '2026-07-16 20:03:54.892445+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', false, 'info'),
	('3d806e20-edea-4add-a7e8-5b8451b973f1', '2026-07-16 20:03:54.892445+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', false, 'info'),
	('e82c34bf-fbba-40f3-b43b-973e480e3f39', '2026-07-16 20:04:07.202712+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', true, 'alert'),
	('0f772b34-f769-4cae-8f6a-e9750e7193ff', '2026-07-16 20:04:07.202712+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', false, 'alert'),
	('6b4a9e92-6e60-4191-aee9-a4735e795e7f', '2026-07-16 20:04:07.764837+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Prueba reapertura mi pa', '?task=c60e07fb-0e61-4821-85dd-d9881eed4a75', true, 'info'),
	('dd224b72-b9a1-4822-90da-be74e3e46e41', '2026-07-16 20:04:35.376316+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', false, 'success'),
	('ce75ef65-5e81-417a-acde-31bcb0961eca', '2026-07-16 20:07:24.2272+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'alert'),
	('a21a5f27-372a-4a4b-9898-e81477563c64', '2026-07-16 20:07:24.2272+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'alert'),
	('49e99d71-aa1c-4632-a30e-6145a73603d8', '2026-07-16 20:07:24.2272+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'alert'),
	('44ddab18-cf8b-447b-8167-e0682165885c', '2026-07-16 20:07:24.2272+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'alert'),
	('1cd1f64e-f09b-4a92-bbe7-8856a5f89ff3', '2026-07-16 20:07:24.690106+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Compliance tip julio', '?task=a77e2263-6c29-42c3-8159-9d8d83bf962d', false, 'info'),
	('eab5e1b9-cef8-43ad-bdb9-04d51e7ef2db', '2026-07-16 20:22:39.807806+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Arte para mailing del Día de la Seguridad ', '?task=a94fe95e-6447-49e4-94c2-1f02f441e21c', false, 'info'),
	('da347684-5714-438e-840c-02585e801b8e', '2026-07-16 20:22:40.198707+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Arte para mailing del Día de la Seguridad ', '?task=dc83681e-4ea8-4012-a463-3e86795e907c', false, 'info'),
	('640a9652-932b-48bf-a069-beda7f1c88a6', '2026-07-16 20:24:21.847545+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Dinámicas Giveaways', '?ticket=b5c868b4-829b-4a06-833c-f86333fe605b', false, 'alert'),
	('32276d75-3e98-462d-9284-af128be5ecd1', '2026-07-16 20:24:21.847545+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Dinámicas Giveaways', '?ticket=b5c868b4-829b-4a06-833c-f86333fe605b', false, 'alert'),
	('d2539ce3-2899-414a-b205-b6cfc0f14861', '2026-07-16 20:24:21.847545+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Dinámicas Giveaways', '?ticket=b5c868b4-829b-4a06-833c-f86333fe605b', false, 'alert'),
	('1e7dfdea-3579-49bc-af3e-3476ae117f7e', '2026-07-16 20:24:21.847545+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Dinámicas Giveaways', '?ticket=b5c868b4-829b-4a06-833c-f86333fe605b', false, 'alert'),
	('83e79a17-f0ef-4738-9964-020dff677346', '2026-07-16 20:26:48.727207+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de RP para: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'success'),
	('9f21828a-bb13-43d1-985d-ce227a1d08af', '2026-07-16 20:26:48.727207+00', '473016e7-f5e4-451e-a889-8d19a11484f2', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de RP para: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'success'),
	('958a674b-66f3-4c1e-9070-49092e8e85a9', '2026-07-16 20:26:48.727207+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de RP para: Visualización del micrositio ', '?ticket=2dc92d52-5d88-4481-8b3e-b931d11fb4ee', false, 'success'),
	('bf0af9b9-eceb-42f9-b20a-3ebba51517d5', '2026-07-16 19:00:44.828276+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', true, 'info'),
	('f0b241a1-7979-4b6d-beb6-144c20f5ce4c', '2026-07-16 19:37:42.204499+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'NOVO NORDISK ingresó el ticket: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', true, 'info'),
	('55df8997-e70c-45f7-a459-19dd9596b754', '2026-07-16 20:00:49.118252+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', true, 'info'),
	('38ebce93-30b8-4d00-aca4-3f328636ef97', '2026-07-16 20:03:54.892445+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', true, 'info'),
	('20b59eca-557f-4b88-889e-ac444df77f87', '2026-07-16 20:31:44.397+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'success'),
	('ebca69f5-fcaa-4f28-b6fc-6d08c51078df', '2026-07-16 20:31:44.397+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'success'),
	('3e6e2e09-0287-48c7-97c3-fdab2193136a', '2026-07-16 20:31:44.397+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'success'),
	('f95d7a39-b86b-4929-aad3-ca2212d3cc50', '2026-07-16 20:31:44.397+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Comunicado Aviso External Support Analyst', '?ticket=5338889e-badf-4b6f-abaf-b0889db71658', false, 'success'),
	('89e9dcba-95d9-46f4-b4dc-3854e2e4395b', '2026-07-16 20:33:31.424328+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', false, 'success'),
	('6087dd31-394f-4848-b9fe-3ff06afe0ff9', '2026-07-16 20:33:31.424328+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', false, 'success'),
	('f2f3320c-b6fc-45cd-9a93-2a7e96937476', '2026-07-16 20:33:31.424328+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', false, 'success'),
	('b2f07961-7894-4daf-89e6-7de0796eebbf', '2026-07-16 20:33:31.424328+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Tips 5s julio', '?ticket=32b61433-ed15-47eb-bdab-b1ab77a6c432', false, 'success'),
	('6969ab2b-4c41-454a-82ef-be5e0696d968', '2026-07-16 20:04:35.376316+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Prueba reapertura mi pa', '?ticket=81fb4853-aea7-4179-997e-68374790442a', true, 'success'),
	('ea0ee2ce-7a20-4eda-bd36-6a0a675c538d', '2026-07-16 20:45:37.349182+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'info'),
	('2e08da7a-dd08-49f6-a282-1f639b74c1eb', '2026-07-16 20:45:37.349182+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'info'),
	('57688488-8b31-4ac1-b256-936f9eda1ba0', '2026-07-16 20:45:37.349182+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'info'),
	('3b965436-ba2f-4d90-ba00-15400273fd63', '2026-07-16 20:46:22.985632+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'info'),
	('e4222c37-5784-4a1c-b7ec-50f5385667dd', '2026-07-16 20:46:22.985632+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'info'),
	('a66a21d4-330d-4f60-9bca-58e6a82b2ac8', '2026-07-16 20:46:22.985632+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'info'),
	('b8bd6944-5388-4c89-b5e0-75495ed1bdfc', '2026-07-16 20:47:13.023781+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'alert'),
	('5fd33333-2ec7-4ad3-8ce9-9d0e09cda117', '2026-07-16 20:47:13.023781+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'alert'),
	('73e838f1-4574-4228-8bb4-1e77672ce92c', '2026-07-16 20:47:13.023781+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'alert'),
	('c47ce533-299b-435e-a83f-197315aba430', '2026-07-16 20:47:13.023781+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'alert'),
	('4316e5e0-5065-4331-8272-61de8b9299af', '2026-07-16 20:47:13.023781+00', '473016e7-f5e4-451e-a889-8d19a11484f2', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'alert'),
	('a6046c33-dde1-4708-bf81-6d30548e74ef', '2026-07-16 20:47:13.023781+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', false, 'alert'),
	('8415ee3c-6120-495b-af19-da05f82ea494', '2026-07-16 20:47:13.784509+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Diseñar la primera versión del programa', '?task=5d45cdf7-96d9-4995-9a3c-c7156914809b', false, 'info'),
	('488e65e6-8f67-4d9c-8bd8-81e335b0df6a', '2026-07-16 20:48:18.83269+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'alert'),
	('3595890b-037a-4df3-85dd-0c4ea558e6ec', '2026-07-16 20:48:18.83269+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'alert'),
	('6bddf936-b552-4a66-beb5-70ca64ca1f74', '2026-07-16 20:48:18.83269+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'alert'),
	('688fc4e4-ddc9-449c-986f-70350a814a09', '2026-07-16 20:48:18.83269+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'alert'),
	('096f5a7a-4185-4ef6-8cd6-dbf280228744', '2026-07-16 20:48:18.83269+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'alert'),
	('f345f0b7-29f6-4406-98a9-5ccbb6741059', '2026-07-16 20:48:18.83269+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'alert'),
	('1d28a9cd-e4bd-4f56-a51f-74bf310ebee7', '2026-07-16 20:48:18.83269+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'alert'),
	('1a6d51a6-dc37-4083-93e7-5567e3c201d4', '2026-07-16 20:48:19.433898+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Sesiones de Salud y Vida', '?task=a0d9388e-4aab-40ee-a833-4fae7401d586', false, 'info'),
	('5403cc59-d4b3-43d1-81eb-7ae0d3f8cae9', '2026-07-16 20:48:19.433898+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Sesiones de Salud y Vida', '?task=a0d9388e-4aab-40ee-a833-4fae7401d586', false, 'info'),
	('e840dae6-2e6a-423b-bd17-1d8b04124ed3', '2026-07-16 20:48:56.05882+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Sesiones de Salud y Vida', '?task=a0d9388e-4aab-40ee-a833-4fae7401d586', false, 'info'),
	('de5de6f9-b640-4493-8bc9-6c4ca6e0b987', '2026-07-16 20:48:56.05882+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Sesiones de Salud y Vida', '?task=a0d9388e-4aab-40ee-a833-4fae7401d586', false, 'info'),
	('9674f201-27d3-4d5c-990b-656282de0938', '2026-07-16 20:48:56.47426+00', '897e2dd9-2646-4d9e-a20d-f40da228e85e', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Sesiones de Salud y Vida', '?task=bf40462b-f659-4260-9f05-88010ff824ac', false, 'info'),
	('7b1d261f-d9c3-4f6a-aa77-6f098a3b140b', '2026-07-16 20:50:36.147529+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Nike ingresó el ticket: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'info'),
	('e383a033-1f24-4438-af47-168e3468b9e4', '2026-07-16 20:50:36.147529+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Nike ingresó el ticket: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'info'),
	('a8deb85c-af9e-4bfb-abe9-f34fcfd8b96b', '2026-07-16 20:50:36.147529+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Nike ingresó el ticket: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'info'),
	('11331dba-ee92-483a-aab6-de119eca8737', '2026-07-16 20:50:50.455701+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'alert'),
	('ea7b9bf9-266a-4d01-877c-befb41e01bae', '2026-07-16 20:50:50.455701+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'alert'),
	('5eeae392-a5e6-4fdd-9ede-9222ac6fc723', '2026-07-16 20:50:50.455701+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'alert'),
	('eed0851a-27f0-4b7f-966d-4719baa1a792', '2026-07-16 20:50:50.914819+00', '897e2dd9-2646-4d9e-a20d-f40da228e85e', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: PUERTAS PISO 5 CHIVAS', '?task=59a2800a-b7ba-48fe-b95d-4439a2ee70b9', false, 'info'),
	('ada7b4e9-4ec5-4770-b54a-03c7c51f0631', '2026-07-16 21:00:00.565668+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Comunicado Aviso External Support Analyst', '?task=a422f24d-c96d-411a-808b-3b328a555b6d', false, 'info'),
	('67d006d4-c508-43d5-8237-af1a5f245e89', '2026-07-16 21:00:00.914062+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Comunicado Aviso External Support Analyst', '?task=29cff1de-eeb2-4a6a-ad8d-4ac452b15908', false, 'info'),
	('a5e7c133-d252-4b09-ab95-d4ed05771618', '2026-07-16 21:02:18.660508+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Arte para mailing del Día de la Seguridad ', '?ticket=289bddd0-68e5-4f8a-a238-237d9ff09d93', false, 'success'),
	('e755247b-6586-428c-b722-9f5887e92bed', '2026-07-16 21:02:18.660508+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Arte para mailing del Día de la Seguridad ', '?ticket=289bddd0-68e5-4f8a-a238-237d9ff09d93', false, 'success'),
	('cbb6c503-dd33-4c2d-af05-4a346a34e138', '2026-07-16 21:02:18.660508+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Arte para mailing del Día de la Seguridad ', '?ticket=289bddd0-68e5-4f8a-a238-237d9ff09d93', false, 'success'),
	('d865ccab-71e8-4b26-b1d2-8856633c5704', '2026-07-16 20:45:37.349182+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Bridgestone Interna ingresó el ticket: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', true, 'info'),
	('a8d56c4b-a028-407f-8a35-dfeccd260b6a', '2026-07-16 20:46:22.985632+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'AMSOFIPO ingresó el ticket: Diseñar la primera versión del programa', '?ticket=02a3a945-7dee-466e-b018-78e2c3c07a74', true, 'info'),
	('199c2c9f-41e2-47b4-a1a2-7bd3fc695c37', '2026-07-16 20:50:36.147529+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Nike ingresó el ticket: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', true, 'info'),
	('3e2b377b-0237-4315-a010-a56e396aae96', '2026-07-16 23:02:09.894431+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'ASSOCIATE EXPERIENCE Grupo Bimbo ingresó el ticket: Master Graphic Associate Experience', '?ticket=a3762086-5db2-47ec-b6e1-01d69e87c072', false, 'info'),
	('ce4ca776-a265-4587-80de-d11b163b0452', '2026-07-16 23:02:09.894431+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'ASSOCIATE EXPERIENCE Grupo Bimbo ingresó el ticket: Master Graphic Associate Experience', '?ticket=a3762086-5db2-47ec-b6e1-01d69e87c072', false, 'info'),
	('bef7372a-b58c-45aa-a00c-ba9dba495715', '2026-07-16 23:02:09.894431+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'ASSOCIATE EXPERIENCE Grupo Bimbo ingresó el ticket: Master Graphic Associate Experience', '?ticket=a3762086-5db2-47ec-b6e1-01d69e87c072', false, 'info'),
	('5c88738c-1bb2-41da-9e15-e0eb6804829d', '2026-07-16 23:16:19.536661+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'success'),
	('fcbc3be6-b55c-470b-8cda-84072ee5d807', '2026-07-16 23:16:19.536661+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'success'),
	('b4dc9f2f-0ab5-4535-a8e2-f58135583b30', '2026-07-16 23:16:19.536661+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'success'),
	('7d006af3-1a4d-4a43-b567-50f5c4628433', '2026-07-16 23:16:19.536661+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'success'),
	('0929d5ec-9b8c-420b-a9c0-78ebbf4cfcd7', '2026-07-16 23:18:16.321371+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Sesiones de Salud y Vida', '?task=a0d9388e-4aab-40ee-a833-4fae7401d586', false, 'info'),
	('5c4603eb-4bbe-496c-a7dd-89ae9838453e', '2026-07-16 23:18:16.321371+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Sesiones de Salud y Vida', '?task=a0d9388e-4aab-40ee-a833-4fae7401d586', false, 'info'),
	('f26ea301-e278-4bf4-a159-c29c2df12519', '2026-07-16 23:18:16.679107+00', '897e2dd9-2646-4d9e-a20d-f40da228e85e', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Sesiones de Salud y Vida', '?task=bf40462b-f659-4260-9f05-88010ff824ac', false, 'info'),
	('810bf096-a793-4ada-b92c-2ffb9bc5c5a2', '2026-07-16 23:27:36.837549+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba23', '?ticket=443b6bf9-088c-432c-8ff6-b9c0d9bfe6ee', false, 'info'),
	('1a1e1d4c-60f5-49a3-afe5-28c01cbd4375', '2026-07-16 23:27:36.837549+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba23', '?ticket=443b6bf9-088c-432c-8ff6-b9c0d9bfe6ee', false, 'info'),
	('4b0d8e3f-5849-41cc-bb7d-dc27c49b8b1c', '2026-07-16 23:27:36.837549+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba23', '?ticket=443b6bf9-088c-432c-8ff6-b9c0d9bfe6ee', false, 'info'),
	('8b51e627-e495-477e-aa7c-b48164a05216', '2026-07-16 23:42:36.682551+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Aver', '?ticket=aa4c9d98-ffa5-470c-8b57-dd199b257344', false, 'info'),
	('51123c0c-5fa2-4159-95b3-f5f864c807a4', '2026-07-16 23:42:36.682551+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Aver', '?ticket=aa4c9d98-ffa5-470c-8b57-dd199b257344', false, 'info'),
	('ca2082bd-c9bb-4f5c-b2f0-c976eb928370', '2026-07-16 23:42:36.682551+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Aver', '?ticket=aa4c9d98-ffa5-470c-8b57-dd199b257344', false, 'info'),
	('7b399574-353d-4130-9018-dceda4463669', '2026-07-16 23:58:24.735446+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'success'),
	('ca2ad5e0-434f-4908-b7f2-426d9002b126', '2026-07-16 23:27:36.837549+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Prueba23', '?ticket=443b6bf9-088c-432c-8ff6-b9c0d9bfe6ee', true, 'info'),
	('28097a47-fea1-4dc2-8976-4e7af8e6242e', '2026-07-16 23:58:24.735446+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'success'),
	('8516d82e-6450-4b08-b17f-2c832db01300', '2026-07-16 23:58:24.735446+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'success'),
	('729a4226-5146-4d87-965b-b360917135c6', '2026-07-16 23:58:24.735446+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'success'),
	('4daffab4-9745-4597-9ddf-7887f1d1d063', '2026-07-17 00:34:12.083034+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Visualización del micrositio ', '?task=55f168ee-3865-4ad6-922c-a56b623f4d6e', false, 'info'),
	('8c3b691e-c522-48b3-90ca-edeedde62806', '2026-07-17 00:34:12.590786+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Visualización del micrositio ', '?task=04cb96e5-5687-4561-b587-bbaca34b9e5e', false, 'info'),
	('bda95b81-4b54-4e82-8e4f-0c715d668b01', '2026-07-17 00:59:55.127841+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'alert'),
	('e9e39c38-b412-45bb-a6d0-12588a613265', '2026-07-17 00:59:55.127841+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'alert'),
	('9ed240f0-0038-493b-a8b0-bbe9aac1c119', '2026-07-17 00:59:55.127841+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Área agregada al proyecto', 'Se activó tu célula en el ticket: Compliance tip julio', '?ticket=c56f1367-cd03-45c2-aac9-dda4966ac3b8', false, 'alert'),
	('6a193e84-9a3e-4ffc-933f-ed4a2cc05d02', '2026-07-17 16:07:41.006543+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Compliance tip julio', '?task=a77e2263-6c29-42c3-8159-9d8d83bf962d', false, 'info'),
	('adca9e2c-c5b5-486e-a655-d798faf69c89', '2026-07-17 16:25:14.698096+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Nueva Tarea Asignada', 'Recibiste la pieza de Programación para: Actualizar base de datos para envío de newsletter', '?task=18214486-f45a-4080-9fe8-08c44b78e641', false, 'info'),
	('540c6b8a-c2b8-4248-a740-c20f48c294e7', '2026-07-17 16:25:15.470879+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Nueva Tarea Asignada', 'Recibiste la pieza de RP para: Actualizar base de datos para envío de newsletter', '?task=0c041f1b-c7f9-4cbc-b892-83fbeabc9c93', false, 'info'),
	('93a1eedb-ac57-4347-a4ef-849e9e17f770', '2026-07-17 16:28:53.234983+00', '17d5d747-fdd1-4d4f-88cc-aa2909995088', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'success'),
	('4a07044a-6f77-4245-92fd-3f9173851e78', '2026-07-17 16:28:53.234983+00', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'success'),
	('a2f5d3ed-b061-4301-82fc-4aa74114744c', '2026-07-16 23:02:09.894431+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'ASSOCIATE EXPERIENCE Grupo Bimbo ingresó el ticket: Master Graphic Associate Experience', '?ticket=a3762086-5db2-47ec-b6e1-01d69e87c072', true, 'info'),
	('2b3358c3-3e17-4f4f-8657-a35c83dbcf63', '2026-07-16 23:42:36.682551+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: Aver', '?ticket=aa4c9d98-ffa5-470c-8b57-dd199b257344', true, 'info'),
	('2d81dec7-b3da-4037-a6b7-4607e1583d49', '2026-07-17 18:35:15.623182+00', '5b26a7e6-dc6f-47a6-9d86-0447b1dcc4dd', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdasdxasdasd', '?ticket=6f7e7b75-9bf0-4d75-a6f5-d32f4ff45f74', false, 'info'),
	('28ae8d22-4135-4e95-a124-d4d61fd0c8ff', '2026-07-17 18:35:15.623182+00', '6901712f-b020-4eec-83eb-13d1eff277c0', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdasdxasdasd', '?ticket=6f7e7b75-9bf0-4d75-a6f5-d32f4ff45f74', false, 'info'),
	('a666744e-410c-405b-b05a-8da76063b5aa', '2026-07-17 18:35:15.623182+00', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdasdxasdasd', '?ticket=6f7e7b75-9bf0-4d75-a6f5-d32f4ff45f74', false, 'info'),
	('07b6c3d4-400a-404a-8f79-0273a2be2960', '2026-07-17 18:35:15.623182+00', '7e6ae7be-9b76-4400-94b1-a6571016ca87', 'Nueva Solicitud Global', 'Tolko ingresó el ticket: dasdasdxasdasd', '?ticket=6f7e7b75-9bf0-4d75-a6f5-d32f4ff45f74', false, 'info'),
	('9b4c5741-8705-455d-9291-8b772b2077cd', '2026-07-17 16:28:53.234983+00', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Programación para: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', true, 'success'),
	('502862a0-0a49-45bb-ae35-86026b34ab24', '2026-07-17 20:08:46.679591+00', '79296d44-1dcc-43ae-9b98-d94378ed37c0', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de RP para: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'success'),
	('06f84ce5-a1da-4cec-b2ec-6f2d8fe0f9de', '2026-07-17 20:08:46.679591+00', '473016e7-f5e4-451e-a889-8d19a11484f2', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de RP para: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'success'),
	('fc79de90-392a-4082-a349-413ba191fa89', '2026-07-17 20:08:46.679591+00', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de RP para: Actualizar base de datos para envío de newsletter', '?ticket=39814a11-6b11-44dc-bf31-a13902f75174', false, 'success'),
	('97332364-b5f5-4d54-8797-94db61481fb5', '2026-07-17 20:24:31.947013+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', false, 'success'),
	('d9abee25-8084-4fcb-8e9f-c3ba46198087', '2026-07-17 20:24:31.947013+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', false, 'success'),
	('7a1dce27-ce14-4bcf-b3cf-078766a35d89', '2026-07-17 20:24:31.947013+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', false, 'success'),
	('0cdabd75-ce7b-4714-80bf-17b0dd42eaae', '2026-07-17 20:24:31.947013+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Invitación examen Go Fluent', '?ticket=22f64b33-fbe4-4da8-ae5f-b7aac0342a12', false, 'success'),
	('56f58f09-fc37-45be-8f7d-0c6f413a70a2', '2026-07-17 20:25:20.535874+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Nueva Tarea Asignada', 'Recibiste la pieza de Contenido para: Comunicación ganadores reto Go Fluent', '?task=9af1d207-c1cd-4db0-a5ec-f389df440af2', false, 'info'),
	('55ffd6a6-f171-488d-bae9-aa835862aea8', '2026-07-17 20:25:21.027922+00', '897e2dd9-2646-4d9e-a20d-f40da228e85e', 'Nueva Tarea Asignada', 'Recibiste la pieza de Diseño para: Comunicación ganadores reto Go Fluent', '?task=a3868554-3f75-4462-b52a-dc27c2710c24', false, 'info'),
	('1b76b4ac-20ba-4db0-95bf-61d070ae133e', '2026-07-17 20:27:41.528632+00', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', false, 'success'),
	('1d10e90a-35d7-4b8e-9f48-169a2567bfab', '2026-07-17 20:27:41.528632+00', 'f018a13c-779a-4435-92c2-53b133c2a72d', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', false, 'success'),
	('bb12d1e1-7534-4c64-ab50-9699a33b030d', '2026-07-17 20:27:41.528632+00', '4b4cc46b-65be-4faa-9d06-81e4d6893343', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', false, 'success'),
	('1ab5ca64-1e8d-4869-a958-931510f5a488', '2026-07-17 20:27:41.528632+00', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Contenido para: Pantallas Tip 5s julio', '?ticket=d45c7e7c-02ec-4d6d-9053-82199ead5f88', false, 'success'),
	('b14ce5f7-7e52-45c0-874f-a0b397b06d02', '2026-07-20 15:33:39.504488+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Comunicación ganadores reto Go Fluent', '?ticket=00e8e07e-f82a-46db-ae39-6ae73966e8d3', false, 'success'),
	('25d00c13-302d-44d8-bf5e-77d8732bb5d5', '2026-07-20 15:33:39.504488+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Comunicación ganadores reto Go Fluent', '?ticket=00e8e07e-f82a-46db-ae39-6ae73966e8d3', false, 'success'),
	('3714b751-067b-47f7-9955-71b374e62d76', '2026-07-20 15:33:39.504488+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Comunicación ganadores reto Go Fluent', '?ticket=00e8e07e-f82a-46db-ae39-6ae73966e8d3', false, 'success'),
	('f82c1154-7005-4513-975c-1df148c3528f', '2026-07-20 15:34:01.617906+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'success'),
	('99732781-c768-43af-b54c-a52aebea9749', '2026-07-20 15:34:01.617906+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'success'),
	('3e3f6ad9-7048-46a9-b6c0-250600a33047', '2026-07-20 15:34:01.617906+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: Sesiones de Salud y Vida', '?ticket=155502e6-f2ad-4057-a870-430f718b9cf0', false, 'success'),
	('5d4ce224-6347-402a-acce-46ec16d542e9', '2026-07-20 15:34:18.910849+00', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'success'),
	('c67688e7-8860-44e6-ab57-4d6fbc0431ed', '2026-07-20 15:34:18.910849+00', '855ecf57-5a53-4e36-91db-d4e607a8bb42', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'success'),
	('765061a9-1894-487d-9df4-3d6cfd33081e', '2026-07-20 15:34:18.910849+00', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', 'Pieza Lista para Revisión', 'Tu célula envió un entregable de Diseño para: PUERTAS PISO 5 CHIVAS', '?ticket=176a391a-f55d-4976-b457-91e95299f432', false, 'success');


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organizations" ("id", "name", "logo_url", "industry", "created_at", "address", "primary_color", "secondary_color", "banner_url", "distribution_email", "is_active") VALUES
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', 'POSADAS', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783703513043.webp', 'Entretenimiento', '2026-07-07 16:12:38.628225+00', 'Prolongación Paseo de la Reforma 1015 Piso 9 Torre A Col Santa Fe Del. Álvaro Obregón CP 01210, México DF.', '#967E31', '#F2F2F2', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783703514518.webp', 'grupoposadas@tolkogroup.com', true),
	('051f02c8-1f4f-4bf6-9b69-de723d78bc3b', 'Bridgestone Linkedin', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783705295269.webp', 'Comunicación, Automovilístico', '2026-07-07 00:51:19.646426+00', 'calle', '#FF0000', '#333333', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783704119064.webp', 'bridgestonelinkedin@tolkogroup.com', true),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'AMSOFIPO', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783702506958.webp', 'Finanzas', '2026-07-07 00:58:43.830876+00', 'Av. Insurgentes Sur #2047, Esq. Cracovia Edificio “B-Edif “B, San Ángel, Álvaro Obregón, 01000 Ciudad de México, CDMX', '#4D008C', '#C028B9', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783702508125.webp', 'amsofipo@tolkogroup.com', true),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', 'PROXPER', NULL, 'Finanzas', '2026-07-09 22:48:26.268426+00', NULL, '#D3002D', '#0F0F12', NULL, NULL, true),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'NOVO NORDISK', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1784052079529.webp', 'Salud', '2026-05-28 19:25:46.910582+00', NULL, '#001965', '#a8b1bd', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1784052080242.webp', 'novo@tolkogroup.com', true),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', 'GRUPO BIMBO', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1784052400014.png', 'Industrial', '2026-07-09 22:50:29.056323+00', NULL, '#E62530', '#263576', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1784052400601.jpg', NULL, true),
	('aedf2ba6-0f8e-4136-95e3-e8372b002c80', 'EBC', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1784220562817.png', 'Educación, Finanzas', '2026-07-16 16:49:24.414753+00', 'Liverpool 54, Col. Juárez, C.P. 06600, Alcaldía Cuauhtémoc.', '#0060C5', '#EEEDEE', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1784220563494.jpg', NULL, true),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', 'CREDICLUB', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783704272974.webp', 'Finanzas', '2026-07-07 01:21:58.040822+00', 'Avenida San Jerónimo 310, Piso 27, Colonia San Jerónimo, Monterrey, Nuevo León. C.P. 64640.', '#0A3333', '#00AFAd', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783706042719.webp', 'crediclub@tolkogroup.com', true),
	('cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Tolko', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/1781627237332.png', 'Comunicación', '2026-06-16 16:27:18.84853+00', 'Av. Río San Joaquín 436-piso 14, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX', '#eb0033', '#0F0F12', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1784071589520.jpg', 'oluna@tolkogroup.com', true),
	('7685e766-8085-4947-ab3b-03d86900428c', 'CYDSA', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783703364963.webp', 'Industrial', '2026-07-07 15:37:20.332718+00', 'Av. Insurgentes Centro 800, Col del Valle Centro, Benito Juárez, 03100 Ciudad de México, CDMX', '#0048B7', '#E8EEF3', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783703365517.webp', 'cydsa@tolkogroup.com', true),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', 'BIOPAPPEL', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783703938644.webp', 'Industrial', '2026-07-07 01:15:37.730394+00', 'Av. Ejército Nacional Mexicano 1130, Polanco, Polanco I Secc, Miguel Hidalgo, 11510 Ciudad de México, CDMX', '#A0D141', '#CD3B2F', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783703939550.webp', 'biopappel@tolkogroup.com', true),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', 'ENFRAGEN', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1784051998422.webp', '', '2026-07-07 15:51:27.369559+00', NULL, '#415465', '#f05323', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1784052000563.webp', 'enfragen@tolkogroup.com', true),
	('129bbae1-e29d-44ec-931f-95059748a3d6', 'Pluxee', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/1779994681881.png', 'Finanzas', '2026-05-28 18:58:04.344759+00', 'Blvd. Miguel de Cervantes Saavedra 251, Granada, Miguel Hidalgo, 11520 Ciudad de México, CDMX', '#00F043', '#241B4A', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783704433268.webp', 'pluxee@tolkogroup.com', true),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', 'AMIB', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783703835116.webp', 'Finanzas', '2026-07-07 00:56:13.562248+00', 'Av. P.º de la Reforma 255-Primer Piso, Cuauhtémoc, 06500 Ciudad de México, CDMX', '#004079', '#FFA600', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783703837471.webp', 'amib@tolkogroup.com', true),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Bridgestone Interna', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1782414315864.jpg', 'Automovilístico', '2026-06-25 19:05:20.092+00', '4, Juan Vázquez de Mella 481, Polanco, Polanco I Secc, 11510 Ciudad de México, CDMX', '#FF0000', '#333333', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1782414316610.png', 'bridgestoneinterna@tolkogroup.com', true),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', 'GLENFARNE', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1784052036472.webp', 'Industrial', '2026-07-07 15:58:14.646028+00', NULL, '#4c616e', '#eee7dd', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1784052036811.webp', 'glenfarne@tolkogroup.com', true),
	('deb472a1-6ab3-43e1-8213-c3c22ac6c100', 'ASSOCIATE EXPERIENCE Grupo Bimbo', NULL, 'Alimentos / Consumo', '2026-07-16 22:37:35.415274+00', 'SANTA FE, CDMX', '#1a5fea', '#d6dcf5', NULL, 'associateexpgb@tolkogroup.com', true),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Nike', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1782410270945.jpg', 'Deportes', '2026-05-28 19:55:00.022555+00', ' Calz Legaria 549-Piso 7, México Nuevo, Miguel Hidalgo, 11250 Ciudad de México, CDMX', '#f0a400', '#02c7ca', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1782410316842.webp', 'nike@tolkogroup.com', true),
	('1eeccd3a-672b-4142-9fb3-ff13e7f38f2c', 'Alaska LNG', NULL, 'Energía', '2026-07-20 15:56:05.443549+00', 'New York, New York', '#0050d1', '#fcff42', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1784562964818.jpeg', NULL, true),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', 'SAZONE', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783631628331.png', 'Alimentos / Consumo', '2026-07-09 21:13:49.955021+00', NULL, '#c64993', '#455a9f', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783631628947.jpg', 'sazone@tolkogroup.com', true),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', 'BAYER', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/logo_1783702048166.webp', 'Salud', '2026-07-07 01:07:24.448539+00', 'Blvd. Miguel de Cervantes Saavedra 259, Granada, Miguel Hidalgo, 11520 Ciudad de México, CDMX', '#8ad329', '#00BCFF', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/logos/banner_1783702052833.webp', 'bayer@tolkogroup.com', true);


--
-- Data for Name: organization_deliverables; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organization_deliverables" ("id", "organization_id", "name", "category_id", "target_format_id", "is_active", "created_at") VALUES
	('cb9e39c0-e982-4e93-abf7-6280cc5bb083', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Imagen', 8, 4, true, '2026-07-15 20:26:03.258983+00'),
	('574442d9-8b57-4cb8-933a-745a38755708', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Comunicado Whatsapp', 8, 4, false, '2026-06-25 22:50:52.603263+00'),
	('fdb775f9-823a-49f6-8e58-033a96dbe913', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Video', 1, 1, false, '2026-06-25 22:51:01.648187+00'),
	('c92f6875-d1e0-42e8-a1b4-5d10d911b5af', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Newsletter', 13, NULL, false, '2026-07-13 17:42:00.443648+00'),
	('9cd7aee4-e326-42f5-99bf-f0d278734faa', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Infografía', 8, 3, false, '2026-06-25 22:51:50.633329+00'),
	('f07bc69d-1183-4185-ad07-e417e20f9f49', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Presentación', 5, 7, false, '2026-06-25 22:52:13.109532+00'),
	('a236302c-d56b-4beb-ba8b-7042bebcdfff', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Banner', 8, 4, false, '2026-06-25 22:52:26.237838+00'),
	('474c22dd-2339-4e8b-9139-56184f8dbb16', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Reel tiktok', 1, 2, false, '2026-06-17 18:43:19.356722+00'),
	('bac71a40-f413-4212-91c5-76e6d3f09e5c', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Toolkit', 8, 3, false, '2026-06-17 18:52:27.607083+00'),
	('40edd19d-b289-4ac3-869e-dc3a610d459d', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Newsletter', 13, 6, true, '2026-07-13 17:42:21.491824+00'),
	('3205fd6d-82a4-4b28-849c-8bf389079365', '3d026c49-2360-4262-a900-aaeac26ebd0a', 'Mockup del micrositio', 13, 6, true, '2026-07-16 01:18:59.693799+00'),
	('4e07c6d7-2ea2-4b0b-8013-531661255ecb', '051f02c8-1f4f-4bf6-9b69-de723d78bc3b', 'Recap', 1, 1, true, '2026-07-14 23:16:44.828681+00'),
	('48d9dbe9-532f-477f-9a69-2bde0a8e7225', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Otro', 6, 6, false, '2026-06-17 19:25:13.189251+00'),
	('306bdd4c-1979-4bfc-90b0-1b09633dc58d', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Presentacion corporativa', 8, 1, false, '2026-06-17 18:54:14.983007+00'),
	('4b3c507a-f31e-4f11-bff3-b524347c86da', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Apis News', 13, 6, false, '2026-06-25 22:51:15.028562+00'),
	('c3fd2de2-8fac-49f8-81e9-a8722c6a7a99', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Especifico', 13, 6, false, '2026-06-17 19:24:58.799912+00'),
	('372ec871-11c7-453b-ae00-430d32a33c66', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Logotipo AMS', 8, NULL, true, '2026-07-16 17:25:31.31682+00'),
	('22175f1f-ae5a-41fb-a046-ffdb84972a0d', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Actualización de base de datos', 3, NULL, true, '2026-07-16 18:59:30.143389+00'),
	('75000135-88bd-4357-826a-c0969b1cae4a', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'GbEcard', 8, 3, false, '2026-06-17 18:57:37.659633+00'),
	('10fd5424-191a-4542-8262-ab85c33d4129', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Impresión', 8, 11, true, '2026-06-26 15:53:41.432739+00'),
	('26f5811f-41b7-4d88-9ce5-45592d5f3020', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Comunicado', 8, 5, true, '2026-06-26 15:54:01.020594+00'),
	('9c4ce91c-afad-456a-91e3-9afda8184067', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Pantalla', 8, 5, true, '2026-06-26 15:54:19.32614+00'),
	('80d03d05-883a-496e-8145-e01218cf76a0', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'ApisNews', 13, 6, true, '2026-06-26 15:54:35.438463+00'),
	('f8ba1b03-ec2b-40a7-9620-e84242fb09fb', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Infografía', 8, 5, true, '2026-06-26 15:54:54.405705+00'),
	('a0f3cd15-76e7-4265-aa98-ab1dd90565f3', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Presentación', 3, 14, true, '2026-06-26 15:55:13.747192+00'),
	('8a4bb644-d8ee-4441-9cc1-99eb80f7c549', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Banner', 13, 6, true, '2026-06-26 15:55:29.635979+00'),
	('f6e69a12-5360-461f-ba19-00a80c186acb', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Save the Date', 8, 3, true, '2026-06-26 15:55:42.817535+00'),
	('e9085006-b8ea-4ff8-be22-ce3365253814', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Post Viva Engage', 6, 13, true, '2026-06-26 15:58:22.585005+00'),
	('2e5ae0d8-436b-4f8c-b98c-f2c8f47a5904', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Comunicado WhatsApp', 3, 5, true, '2026-06-26 16:01:16.570907+00'),
	('fa236817-784d-4bdc-bf3e-ab364137a199', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Landing Page', 13, 6, true, '2026-06-26 16:01:31.820701+00'),
	('60152091-1006-4810-a31a-09d009394ac8', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Master', 8, 5, true, '2026-06-26 16:01:50.75478+00'),
	('505f7416-ed71-4e62-99dd-6c7871264f85', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Logo', 8, 3, true, '2026-06-26 16:02:03.1645+00'),
	('5635592c-c6aa-4213-9ba8-b66eece5f7b9', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Invitación', 8, 5, true, '2026-06-26 16:05:37.463127+00'),
	('96e5139a-9651-403a-b81b-8de324a7c439', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Plan / estrategia', 6, 5, true, '2026-06-26 16:05:47.750869+00'),
	('e25b3396-128f-401e-b0d8-48a54838679e', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Video', 1, 1, true, '2026-06-26 16:06:20.401317+00'),
	('02e40fcd-ea58-4627-a180-f2e711629f7e', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Presentación', 5, 14, true, '2026-06-26 16:06:36.45551+00'),
	('72d7c62b-fa44-46de-81a2-44eed2eeeaed', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Stickers', 8, 3, true, '2026-06-26 16:07:00.023369+00'),
	('836179b0-67e7-47de-88ce-a6cb4ef477c4', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Infografía', 8, 13, true, '2026-06-26 16:07:17.070113+00'),
	('cc3113ba-9505-42df-8043-c6b3ff04ea68', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Save the date', 13, 24, true, '2026-06-26 16:08:35.28289+00'),
	('9c557820-ee06-4f06-a839-2ee7b846607d', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Dinámicas', 3, 5, true, '2026-06-26 16:08:46.436769+00'),
	('2f59a516-a5a1-40ef-924b-985b8ae6bbca', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Producción', 8, 5, true, '2026-06-26 16:08:57.341452+00'),
	('b5f4e38b-7750-4047-b70a-c703d693285a', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Run Of Show', 8, 5, true, '2026-06-26 16:09:11.263619+00'),
	('8464caca-d3ba-4ae3-aecb-db2e63243311', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Plantilla para invitaciones', 8, 5, true, '2026-06-26 16:49:52.398597+00'),
	('03c9e64c-8b7a-4368-99ca-aaf138764ae1', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Plantilla para presentaciones', 8, 4, true, '2026-06-26 16:50:10.561167+00'),
	('090d2773-5a6e-4ae1-94be-d5421ac9a7b4', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Fondo de Microsoft Teams', 8, 4, true, '2026-06-26 16:50:24.881654+00'),
	('2a1fec1a-67bf-4399-8926-6340b619b561', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Pantalla', 8, 5, true, '2026-06-26 16:50:58.423054+00'),
	('b051a332-aa70-43d1-8664-ac98d51cc84e', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Propuesta de nota', 6, 8, true, '2026-06-26 16:51:22.869781+00'),
	('256017f2-0fd5-4188-9ebb-795c0e3172b0', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Video', 1, 1, true, '2026-06-26 16:52:28.419097+00'),
	('cafa6191-f1bd-4f61-a6a9-b6910d730200', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Animación', 12, 19, true, '2026-06-26 16:52:39.240775+00'),
	('3d38caa6-2cf5-4c30-9912-ef3b870126e1', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Banner', 8, 4, true, '2026-06-26 16:52:55.409236+00'),
	('3347adbf-6a4f-4e6a-b101-4b3da2bca113', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Comunicado', 8, 5, true, '2026-06-26 16:53:07.002046+00'),
	('ef6d9fd8-67d4-431a-b649-7a084711f176', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'NewsLetter', 13, 6, true, '2026-06-26 16:53:15.453547+00'),
	('d1ae42ba-b91d-47d7-a829-5ea4e279e853', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Presentación', 3, 14, true, '2026-06-26 16:54:04.045154+00'),
	('d60cb50a-2f1c-4507-b44b-fe2061709151', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Stickers', 8, 3, true, '2026-06-26 16:54:21.375113+00'),
	('72a451a9-f00c-4528-bb1e-e76becd1896a', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Logo', 8, 5, true, '2026-06-26 16:54:28.50416+00'),
	('9d012d43-fed5-4d11-ac54-bd0821f935fe', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Impresión', 8, 5, true, '2026-06-26 16:54:37.719819+00'),
	('2f554097-5553-4f48-aaf0-1bd36c264c57', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Linea de partida', 13, 6, true, '2026-07-06 17:16:20.086945+00'),
	('864f7d71-8675-439c-ac36-987da7a5ffdb', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Newsletter', NULL, NULL, false, '2026-07-13 17:41:16.260347+00'),
	('daad60fc-6dff-4574-a043-f6617bfd0d37', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Invitación', 8, 4, true, '2026-07-14 23:37:47.588815+00'),
	('37672a50-5c59-4b0d-862c-828a3ed65ccf', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Invitación para mail', 8, 4, true, '2026-07-14 23:39:49.356254+00'),
	('b3b536ef-8d69-4cd5-8424-ededf5153140', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Infografía', 8, 4, true, '2026-07-14 23:44:32.390874+00'),
	('1dfdc196-e2af-4c2d-9a99-86d0a1c02472', '96018fdc-ce59-46fe-871c-442a3ba0d860', 'Un diseño', 8, 11, true, '2026-07-15 00:40:34.850977+00'),
	('808ca2a5-036d-458a-ac78-8cea9a6770c2', '13b24dea-913b-4025-a4c2-b7a847a7401c', 'Folder con stickers', 8, NULL, true, '2026-07-15 16:33:26.837298+00'),
	('a495690e-1608-435d-9936-ef61f88404fd', '13b24dea-913b-4025-a4c2-b7a847a7401c', 'Pizarron', 8, NULL, true, '2026-07-15 16:33:50.03223+00'),
	('f518c929-7eb1-4bb6-b55f-677b733cb14a', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Documento', 8, 5, true, '2026-07-15 18:44:26.364571+00'),
	('9d15bf8f-cb69-4623-9d95-1e7474c80991', '7685e766-8085-4947-ab3b-03d86900428c', 'PANTALLAS', 8, 4, true, '2026-07-15 19:11:04.763066+00'),
	('af86f981-048d-4b18-b9e6-1de6817c4418', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'FORMS', NULL, NULL, false, '2026-07-15 19:17:31.018645+00'),
	('e0429c10-a0cd-4342-b12c-fee36be0e232', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'FORMS', 13, 6, true, '2026-07-15 19:17:48.412975+00'),
	('0692b136-76bb-41fc-a05e-eac6d4b5120e', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Run Of Show', 8, 5, false, '2026-06-26 16:06:03.88482+00'),
	('4c277094-a1cf-456d-8035-daf962a4a7c9', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Newsletter de 2 notas', 6, 6, true, '2026-07-15 19:25:45.494839+00'),
	('41515394-f6b5-4435-8afb-32029bf65958', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Inforgrafía/ Pantallas', 8, 4, true, '2026-07-16 19:53:22.396869+00'),
	('a562bdf0-57cf-48f0-95f7-fbb9bd01f8c5', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Programa', 8, NULL, true, '2026-07-16 20:45:09.561757+00'),
	('bc416e42-90fd-435b-89b1-b4f93503cec2', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'impresión', 14, 4, true, '2026-07-16 20:49:59.483923+00'),
	('b656eed2-2396-449d-b3f6-a9ba8e6904af', 'deb472a1-6ab3-43e1-8213-c3c22ac6c100', 'Master Graphic', 8, 4, true, '2026-07-16 22:57:48.011819+00'),
	('feeab533-80bf-4818-b468-7088067f0a4f', 'deb472a1-6ab3-43e1-8213-c3c22ac6c100', 'Logo', 8, 4, true, '2026-07-16 22:57:58.499581+00'),
	('85ebdb59-eac3-4f81-810a-3b0d894b6fc7', 'deb472a1-6ab3-43e1-8213-c3c22ac6c100', 'Template PPT', NULL, 14, true, '2026-07-16 22:58:28.35477+00');


--
-- Data for Name: organization_distribution_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organization_distribution_lists" ("organization_id", "profile_id", "created_at") VALUES
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-05-28 19:30:14.940238+00'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-05-28 20:01:59.531769+00'),
	('cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'aea4aba1-5f0f-4548-8a56-80b3fef4987f', '2026-06-16 17:01:01.112684+00'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-08 20:33:14.379451+00'),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-09 16:07:16.310582+00'),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:07:26.863169+00'),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-09 16:09:23.258331+00'),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-09 16:12:16.026236+00'),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:12:26.482493+00'),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-09 16:12:55.739787+00'),
	('051f02c8-1f4f-4bf6-9b69-de723d78bc3b', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-09 16:13:32.78144+00'),
	('051f02c8-1f4f-4bf6-9b69-de723d78bc3b', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:13:36.023059+00'),
	('051f02c8-1f4f-4bf6-9b69-de723d78bc3b', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-09 16:13:38.411208+00'),
	('051f02c8-1f4f-4bf6-9b69-de723d78bc3b', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-09 16:13:45.298599+00'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-09 16:14:24.125902+00'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:14:27.416152+00'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:14:36.199986+00'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-09 16:15:15.56802+00'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:15:17.977697+00'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-09 16:15:20.741705+00'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:15:36.789106+00'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-09 16:15:40.624575+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:19:46.667376+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:19:48.598706+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-09 16:19:52.43195+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-09 16:19:56.074774+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:23:39.842593+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:24:42.897821+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-09 16:24:45.170812+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-09 16:24:47.973453+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:24:51.121786+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:25:35.160389+00'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:26:17.289589+00'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:26:20.797639+00'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:26:58.222711+00'),
	('7685e766-8085-4947-ab3b-03d86900428c', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:29:01.038112+00'),
	('7685e766-8085-4947-ab3b-03d86900428c', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:29:01.033916+00'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-09 16:29:28.053978+00'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:29:30.138336+00'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-09 16:29:32.429822+00'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:29:36.586625+00'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-09 16:30:04.222964+00'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:30:06.320486+00'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:30:09.44673+00'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:30:11.257735+00'),
	('129bbae1-e29d-44ec-931f-95059748a3d6', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-09 16:30:41.475739+00'),
	('129bbae1-e29d-44ec-931f-95059748a3d6', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-09 16:30:43.406133+00'),
	('129bbae1-e29d-44ec-931f-95059748a3d6', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:30:45.511418+00'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-09 16:31:52.07298+00'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-09 16:31:55.422928+00'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-09 16:31:55.9277+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-09 16:59:27.702122+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', '473016e7-f5e4-451e-a889-8d19a11484f2', '2026-07-10 18:32:31.896966+00'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', '79296d44-1dcc-43ae-9b98-d94378ed37c0', '2026-07-10 18:33:11.584489+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', '79296d44-1dcc-43ae-9b98-d94378ed37c0', '2026-07-10 18:33:38.149466+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:33:45.447222+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', '79296d44-1dcc-43ae-9b98-d94378ed37c0', '2026-07-10 18:33:57.96861+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', '473016e7-f5e4-451e-a889-8d19a11484f2', '2026-07-10 18:34:02.044913+00'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:34:18.561222+00'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-10 18:34:20.478873+00'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', '79296d44-1dcc-43ae-9b98-d94378ed37c0', '2026-07-10 18:34:24.213026+00'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:34:28.976456+00'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', '79296d44-1dcc-43ae-9b98-d94378ed37c0', '2026-07-10 18:35:09.302028+00'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', '473016e7-f5e4-451e-a889-8d19a11484f2', '2026-07-10 18:35:11.623959+00'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-10 18:35:37.100859+00'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:35:38.910283+00'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:35:41.161035+00'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-10 18:35:44.652399+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-10 18:37:04.231621+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-10 18:37:10.108957+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:37:12.469442+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-10 18:37:14.489476+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:37:17.964404+00'),
	('051f02c8-1f4f-4bf6-9b69-de723d78bc3b', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-10 18:37:48.145131+00'),
	('051f02c8-1f4f-4bf6-9b69-de723d78bc3b', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-10 18:37:55.496689+00'),
	('7685e766-8085-4947-ab3b-03d86900428c', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-10 18:38:07.320536+00'),
	('7685e766-8085-4947-ab3b-03d86900428c', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-10 18:38:10.98713+00'),
	('7685e766-8085-4947-ab3b-03d86900428c', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:38:13.777655+00'),
	('7685e766-8085-4947-ab3b-03d86900428c', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:38:15.519737+00'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:38:33.300313+00'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:38:35.344542+00'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-10 18:38:47.554836+00'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:38:51.957566+00'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-10 18:38:59.713752+00'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-10 18:39:01.472752+00'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:39:03.574986+00'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:42:03.86454+00'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-10 18:42:09.115415+00'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-10 18:42:26.983601+00'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-10 18:42:28.722278+00'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-10 18:42:41.772937+00'),
	('129bbae1-e29d-44ec-931f-95059748a3d6', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:43:08.53727+00'),
	('129bbae1-e29d-44ec-931f-95059748a3d6', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-10 18:43:15.076449+00'),
	('129bbae1-e29d-44ec-931f-95059748a3d6', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-10 18:43:17.713409+00'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:43:32.746374+00'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:43:36.323259+00'),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-10 18:43:52.161642+00'),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-10 18:43:54.734104+00'),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-10 18:43:57.111873+00'),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', 'c0205e85-fe64-42e1-ae3b-e68c15e301c8', '2026-07-10 18:43:58.474857+00'),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:44:01.535604+00'),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:44:03.629371+00'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-10 18:44:25.865422+00'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-10 18:44:28.922797+00'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-10 18:44:30.973415+00'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-10 18:44:32.373039+00'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', 'b049d400-3d04-42c5-85c8-3c8732cf7ae7', '2026-07-10 18:44:34.246897+00'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', 'f018a13c-779a-4435-92c2-53b133c2a72d', '2026-07-10 18:44:37.815504+00'),
	('deb472a1-6ab3-43e1-8213-c3c22ac6c100', 'a5709d48-d774-42b3-bf57-5e061ff25d87', '2026-07-16 23:03:25.52571+00'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-17 00:05:23.712525+00'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-17 00:10:26.246253+00'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-17 00:10:39.668263+00');


--
-- Data for Name: organization_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organization_members" ("organization_id", "profile_id", "role_in_org") VALUES
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', '4d21cc67-d670-4142-9620-032f0dcbecf0', 'manager'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', 'manager'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', '9712dc1c-b1e0-4ee5-a42e-b7696677bf2b', 'manager'),
	('ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'befb88e9-fd13-4f79-9622-d6c6bdd52be7', 'manager'),
	('c1a62dd9-d36d-4159-8762-610a7bd609b4', 'a5709d48-d774-42b3-bf57-5e061ff25d87', 'manager'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', '2072a09e-3804-447f-a7f5-efacc0589e83', 'manager'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', '2072a09e-3804-447f-a7f5-efacc0589e83', 'manager'),
	('cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', 'manager'),
	('8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Manager'),
	('97919df1-eafd-4bdc-9d0d-5e52e8c730db', '989c4298-86d3-416a-998f-2e82b3f9e553', 'Manager'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', '0be8c39b-72f0-4d3e-90ec-6713ed8f1325', 'Manager'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', 'debcf540-88f6-4536-bd0f-5b30f2aa4141', 'Manager'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', 'd4fdb7c2-714a-40cc-bc4a-4299a20e0627', 'Manager'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', 'd32486d5-9d77-4934-9130-913398aa0ecc', 'Manager'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', '6996baad-8277-4c4b-b1c8-cbc4fac1005b', 'Manager'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', 'c5711c22-a164-4d7f-8ad3-089635cb544c', 'Manager'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', '98dcd0ea-33e1-430d-b0ee-15e9211e0849', 'Manager'),
	('96018fdc-ce59-46fe-871c-442a3ba0d860', 'e8a43ce5-b3fa-4b23-a8af-256872323fd5', 'Manager'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', 'bef74040-1279-4b76-8cd8-497e37711cd9', 'Manager'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', '7a36964d-aefa-49e3-938c-167fcec411a0', 'Manager'),
	('09ab27cd-7bf3-40cb-bb85-3c45a53adad3', 'd35996b1-2855-424e-bb6e-08d14a02b323', 'Manager'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', 'af62bac6-af87-40f4-b02c-cb46fc5d2b52', 'manager'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', 'ea62dff2-4c5b-43a7-8c10-1ad344e01b3c', 'manager'),
	('dc6f91c9-00b8-43c1-8f85-c86ba9dae750', 'b4c42663-23b0-4426-a256-4deae497e473', 'manager'),
	('aedf2ba6-0f8e-4136-95e3-e8372b002c80', '946ce820-aea2-495b-8856-9593826d2994', 'Manager'),
	('aedf2ba6-0f8e-4136-95e3-e8372b002c80', '75229c3d-19e2-47e0-b351-8e588d6f674d', 'Manager'),
	('aedf2ba6-0f8e-4136-95e3-e8372b002c80', '404e4037-6517-4a5e-b6e5-0f91dccf4aae', 'Manager'),
	('deb472a1-6ab3-43e1-8213-c3c22ac6c100', 'e19b0182-0a1e-4637-b85d-ba337ba2d133', 'Manager'),
	('deb472a1-6ab3-43e1-8213-c3c22ac6c100', '8caa4432-c8a5-44fa-bdad-e38613f029e1', 'manager'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '38fc9683-4851-42fd-9d97-a73e1fecfde9', 'manager'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'manager'),
	('92aa83e5-b23e-4479-93d9-d7209a894f9c', '2072a09e-3804-447f-a7f5-efacc0589e83', 'manager'),
	('3d026c49-2360-4262-a900-aaeac26ebd0a', '2072a09e-3804-447f-a7f5-efacc0589e83', 'manager'),
	('7685e766-8085-4947-ab3b-03d86900428c', '403debcb-7c38-4145-a9ca-3390e1f2b7cd', 'manager'),
	('7685e766-8085-4947-ab3b-03d86900428c', 'b62b0628-d46c-4285-a67c-cf67793786d2', 'manager'),
	('7685e766-8085-4947-ab3b-03d86900428c', 'b19cca69-3f8c-4e00-929a-58df124275bc', 'manager'),
	('27439a44-20a1-4901-bbc3-5b9d909c1842', '2072a09e-3804-447f-a7f5-efacc0589e83', 'manager'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', 'e74cc442-94cd-4986-84ce-e7d96385b779', 'manager'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', 'a6f75547-6426-469a-9248-1489a23c199d', 'manager'),
	('13b24dea-913b-4025-a4c2-b7a847a7401c', '3e49085a-6eaa-456c-9d53-6997d4d30491', 'Manager VIP'),
	('a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'cc5d4b45-dd70-48d5-9cbe-3eb98539ac15', 'Manager'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', '0f0eca6a-1cc7-42d9-959b-2544cb036d36', 'manager'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', '198c855a-2872-44f0-8153-f7c60c93f299', 'manager'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', '156d7e1c-904f-41d9-975e-58fbc686f677', 'manager'),
	('20eed8e1-f22c-4e5c-80ac-cb8ef19fadbb', '2072a09e-3804-447f-a7f5-efacc0589e83', 'manager'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', '7f4722ee-e0f8-44d8-ba09-32b37055f8a2', 'manager'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', '45e18393-6642-47cc-b1dc-e0595089eb85', 'manager'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', 'd946a934-56bd-4e23-b527-c27c927ec455', 'manager'),
	('7828c210-8bcb-4a1b-810d-f8bd0b4f9806', '2072a09e-3804-447f-a7f5-efacc0589e83', 'manager');


--
-- Data for Name: priorities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."priorities" ("id", "level", "color_code", "weight") VALUES
	(1, 'Alta', '#D3002D', 1),
	(2, 'Media', '#B8860B', 2),
	(3, 'Baja', '#002366', 3);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("id", "organization_id", "name", "description", "created_at", "banner_url") VALUES
	('89a15c56-a0a7-4137-8900-1dd3211441a4', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'Otros', NULL, '2026-05-28 19:35:38.532924+00', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/projects/project_1779996937174.jpg'),
	('fe648596-6545-42a2-9694-8187eee85fc9', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'LÍNEA DE PARTIDA', NULL, '2026-05-28 19:58:48.353542+00', NULL),
	('ad899474-fc36-4cc9-a3ac-ea01ab5f89e6', '3d026c49-2360-4262-a900-aaeac26ebd0a', 'Micrositio de Informe de Sustentabilidad 2025', 'Lanzamiento del Informe de Sustentabilidad 2025 que incluye:
- Micrositio 
- Cápsula 
- Envío a periodistas', '2026-07-16 01:17:48.219718+00', NULL),
	('7424c891-ad9a-4f6a-9007-f6a987bbbc36', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'All-Team Metting', NULL, '2026-06-25 19:11:01.411415+00', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/projects/project_1782414656521.webp'),
	('545250ce-af3b-4b74-9537-faf4d966a205', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Carreras', NULL, '2026-06-26 16:04:18.70163+00', NULL),
	('1c029d38-dd67-4d7f-a108-f23a82f3c04c', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Just Play It (Podcast)', NULL, '2026-06-26 16:04:36.650874+00', NULL),
	('950be6dd-1978-4859-be68-fee9a518af33', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Networks', NULL, '2026-06-26 16:04:47.497283+00', NULL),
	('2d19487d-9754-4084-b7bc-49a3183d6314', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Newsletter', NULL, '2026-06-26 16:56:18.001637+00', NULL),
	('286bd647-eda3-4777-b918-3e2268fd479c', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Ingenio Bridgestone', 'La App de Ingenio Bridgestone permite que cualquier colaborador de manufactura Costa Rica envíe ideas de mejora relacionadas con los indicadores (Calidad, Productividad, Seguridad, Ambiente y Costos). Todas las ideas se registran automáticamente y reciben seguimiento por parte del equipo de Mejora Continua y los jefes de producción.

Objetivo de la comunicación:
Informar a todo el personal de manufactura Costa Rica sobre la existencia y uso de la aplicación, incentivar la participación y facilitar el acceso al formulario para enviar ideas desde cualquier computadora de planta u oficina.

El formulario lo pueden encontrar en los navegadores de las computadoras Bridgestone.

Canales solicitados para la campaña:

-Master graphic para imprimir y poner en pizarras (tamaño carta en vertical)

Pantallas internas de la empresa.

Correo electrónico

Imagen como fondo de pantalla en las computadoras.

 

El logo lo pueden cambiar si así lo consideran por algo más creativo, la idea es que con solo verlo se pueda relacionar a Ingenio Bridgestone (que tenga que ver con ideas)', '2026-06-26 21:05:07.832897+00', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/projects/project_1782507906830.jpg'),
	('89c6f1fe-3530-4a92-936c-2fade0dcaabe', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'B-expert', 'Requerimientos para el programa B-expert, una plataforma de entrenamiento en línea sobre nuestro producto dirigida actualmente al equipo de ventas, cuyas sesiones son impartidas por nuestros propios expertos internos.

 

Para el lanzamiento/desarrollo de este programa, vamos a requerir el diseño de los siguientes materiales:

Fondo de Microsoft Teams (para panelistas).

Plantilla para invitaciones (envíos vía Outlook).

Plantilla para presentaciones', '2026-06-26 21:06:56.32881+00', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/projects/project_1782508015093.png'),
	('acb07989-8149-4e23-a1dc-684a9c0da0c3', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Campaña 19K', 'Actualmente estamos en una mala racha de producción de Planta Cuernavaca, por lo que se está accionando un plan integral para revertir esta racha en lo próximo meses.

Por parte de Comunicación Interna estamos pensando en implementar una campaña de motivación para recordarles que el objetivo es producir 19k llantas al día.

 

Algunas ideas que me surgieron:

Crear un personaje relacionado con 19k y llantas

Viniles en el suelo de zonas importantes, como: Comedor, entradas a piso de producción; con frases divertidas y motivadores

Stickers para whatsapp, que ayuden a comunicar: logramos la meta del día, no logramos la meta del día

Animaciones en las pantallas

Calcomanías', '2026-06-26 16:47:48.067625+00', NULL),
	('143440d5-e301-4b78-90c2-f9df382ee990', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Comunicación LOTO', NULL, '2026-07-01 16:25:59.624703+00', NULL),
	('66a841ca-9550-471f-a3bc-1658121a8702', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'BUYING HUB', NULL, '2026-07-06 19:32:28.700588+00', NULL),
	('454dff24-b70e-4a33-b68f-6ea303b8f088', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'Give Your Best', 'Donaciones', '2026-07-06 19:35:31.095184+00', NULL),
	('d0d46c27-3d66-46d9-b470-1addba54c0de', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Transmisión', 'Resultados del trimestre', '2026-07-06 20:19:43.303622+00', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/projects/project_1783369179338.jpg'),
	('ac182b02-7e8a-43dd-9fe7-b8c04aae1737', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', 'ApisNews', NULL, '2026-07-10 17:14:49.679727+00', NULL),
	('b6e72323-4995-4c70-a2db-6ba5a1d45998', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'NIKE BYYOU', NULL, '2026-07-10 23:07:00.329947+00', NULL),
	('0f360111-6541-4ae5-9c4d-40be7e6c9cef', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'General', NULL, '2026-07-10 23:09:39.563723+00', NULL),
	('08594b7f-f383-464f-bacc-5696bc49f123', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'newsletter', 'Es un newsletter', '2026-07-14 18:03:13.530233+00', NULL),
	('7088d5ed-ed69-4ed1-8d68-221398b2a8c1', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', 'Linea de partida', NULL, '2026-07-14 18:53:13.251319+00', NULL),
	('795d2fc0-ebe4-4c3d-b901-18c8894c60fb', '051f02c8-1f4f-4bf6-9b69-de723d78bc3b', 'Grand Prix Indy Finanzas', 'Semana de pláticas y conferencias sobre temas financieros.', '2026-07-14 23:15:34.922051+00', NULL),
	('d8dedafd-64a8-49ab-9778-57e63bb5cdd9', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Go Fluent', NULL, '2026-07-14 23:23:26.660583+00', NULL),
	('6b6ff847-260d-42ac-85ce-f55bb91471fe', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Tips 5s', 'Tip del mes', '2026-07-14 23:43:04.739147+00', NULL),
	('03bbc7c0-c601-4065-bd61-16f26e9bc899', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'CO [PILOTOS]', 'convertimos a los líderes de oficina y planta (desde Supervisores de Línea hasta Directores) en un canal oficial de comunicación, capacitándolos con herramientas ágiles para bajar la estrategia y temas clave a sus equipos.', '2026-07-15 00:02:28.483914+00', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/projects/project_1784073746778.jpg'),
	('4f4235a4-4e9f-4eb2-8095-ad8331260513', '96018fdc-ce59-46fe-871c-442a3ba0d860', 'Propuesta Palomitas SNEF AMIB', 'Diseño muestra de bolsa de celofán, que llevará sticker con cuatro logos (incluido el de AMIB).

Las medidas de la bolsa son 22cm de largo, 9cm de ancho (frente), y 3cm de ancho (lado).

La etiqueta mediría 5cm por 5cm y tendrá dos logos arriba y dos abajo, acomodados en orden alfabético.', '2026-07-15 00:03:03.138824+00', 'https://kptapytkyyvqiiojmrts.supabase.co/storage/v1/object/public/client-logos/projects/project_1784073781911.png'),
	('29b63c79-489b-4b71-9e5a-a0714f5714ac', '13b24dea-913b-4025-a4c2-b7a847a7401c', 'Medica Sur', 'Creación de material personalizable para dar a los pacientes que ya tienen su alta.', '2026-07-15 16:31:23.825294+00', NULL),
	('c9ae17f2-ec80-4603-abea-fe27591e53fd', '7685e766-8085-4947-ab3b-03d86900428c', 'PANTALLAS', NULL, '2026-07-15 19:08:15.082093+00', NULL),
	('7b9f6b6a-ff67-4c9d-b7d4-11c22ee1e48d', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Newsletter Semanal', 'Newsletter con las principales notas de la semana. 
Miriam nos indica los temas a incluir.
Se entrega a cliente los martes para enviar a base de datos los miécoles', '2026-07-15 19:24:53.658682+00', NULL),
	('da1cd3a3-c1ff-470d-a7e7-cbff77ed4980', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Mailings para socios', 'Avisos para socios: 
-Capacitaciones
-Cambios en regulación
etc', '2026-07-15 20:25:31.615697+00', NULL),
	('a0d7aae1-dc06-42c7-a60b-e55a550f084a', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'SNEF', NULL, '2026-07-16 17:23:54.372157+00', NULL),
	('af25134e-2824-46db-a205-9b05f734e3e8', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Compliance TIP', 'Debemos realizar dos infografías (Español/Portugués) con la información que viene en cada una de las ppts; también debemos realizar la adaptación a pantallas en ambos idiomas.', '2026-07-16 19:51:49.033484+00', NULL),
	('0d086f4d-dc15-4865-8588-cbc18ff21b6f', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'Sesiones Informativas', NULL, '2026-07-16 20:44:20.380383+00', NULL),
	('c9c2b029-52fb-4164-8b00-5f9427de6698', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', 'Convención', 'Materiales para la 11a. Convención 
Fecha: Del 30 de septiembre al 1 de octubre', '2026-07-16 20:44:54.414027+00', NULL),
	('0d9b9b49-e8b5-4e65-8e12-8d0a98626a26', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'FUTBOL', NULL, '2026-07-16 20:49:24.099913+00', NULL),
	('cf5a02dd-9289-48f0-86ab-e5225553c9e0', 'deb472a1-6ab3-43e1-8213-c3c22ac6c100', 'Materiales Associate Experience', NULL, '2026-07-16 22:56:23.527595+00', NULL);


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."requests" ("id", "organization_id", "requester_id", "title", "priority_id", "category_id", "target_format_id", "description", "status", "due_date", "created_at", "project_month", "department", "request_date", "quantity", "external_resource_url", "project_id", "needs_design", "needs_dev", "needs_av", "needs_copy", "max_revisions", "revisions_used", "final_deliverable_url", "total_adjustments", "organization_deliverable_id", "cc_emails", "needs_prod", "needs_staff", "needs_rp", "send_email_notification", "original_due_date", "delivered_at", "reopened_at", "updated_at") VALUES
	('c56f1367-cd03-45c2-aac9-dda4966ac3b8', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Compliance tip julio', 1, 8, 4, ' Realizar infografía y adaptar  pantallas en español y portugués ', 'completado', '2026-07-20', '2026-07-16 20:00:49.118252+00', NULL, '', '2026-07-16', 10, 'https://trello.com/c/JRpkQtYI', 'af25134e-2824-46db-a205-9b05f734e3e8', true, false, false, true, 2, 0, NULL, 1, '41515394-f6b5-4435-8afb-32029bf65958', '', false, false, false, false, '2026-07-20', '2026-07-17 20:29:14.137+00', NULL, '2026-07-16 20:00:49.118252+00'),
	('c2b959bd-82ea-4fae-b0a1-9bd9b52602bb', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'ADT 2026 PLAN', 1, 6, 5, 'plan de que es lo que haremos con esas 5 personas, por fa. Recordemos que en esta ocasión la idea no es solo que se ganen un bib, sino que formen parte del squad de empleadas de LatAm que acompañaremos en todo el journey (ese es el recorrido que tenemos que planear). 

Con eso, podremos identificar que es lo que necesitaremos de ellas para que se unan las que estén interesadas y comprometidas en participar en todo, por ejemplo, si vemos que es una buena oportunidad para acompañarlas en su entrenamiento y poder grabar “cápsulas” con ellas, sería fundamental que no le tengan miedo a hablar a la cámara. 

Así que en la convocatoria tenemos que compartir más detalles de lo que significa ser parte de este squad de empleadas, y no solo nos quedemos en que ganan un bib. 

Por otro lado, consideremos que daremos 50% de descuento a 100 empleadas, así que es un gran momento para crear comunidad entre ellas. ¿Será que las 5 elegidas puedan ser clave para apoyarnos a crear esta comunidad? Si sí, otra cosa fundamental sería que disfruten correr acompañadas… 
', 'completado', '2026-07-15', '2026-07-06 19:42:29.918248+00', NULL, 'Plan', '2026-07-06', 1, NULL, '545250ce-af3b-4b74-9537-faf4d966a205', false, false, false, true, 2, 0, NULL, 0, '96e5139a-9651-403a-b81b-8de324a7c439', '', false, false, false, true, '2026-07-15', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('8119ea97-5c57-4578-8f58-12f3a1a500dd', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'b19cca69-3f8c-4e00-929a-58df124275bc', 'Stickers', 2, 8, 3, 'Stickers para whatsapp, que ayuden a comunicar: logramos la meta del día, no logramos la meta del día', 'pendiente', '2026-08-26', '2026-06-26 21:15:06.490518+00', NULL, 'Diseño, Animación', '2026-06-26', 4, NULL, 'acb07989-8149-4e23-a1dc-684a9c0da0c3', false, false, false, false, 2, 0, NULL, 0, 'd60cb50a-2f1c-4507-b44b-fe2061709151', '', false, false, false, true, '2026-09-13', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('d45c7e7c-02ec-4d6d-9053-82199ead5f88', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Pantallas Tip 5s julio', 2, 8, 5, 'Hola, team.
Con la información que viene en la imagen, debemos realizar pantallas 

(del número de pantallas pueden ser menos o más, dependiendo la información)', 'en_proceso', '2026-07-20', '2026-07-14 23:51:39.794155+00', NULL, '', '2026-07-14', 8, 'https://trello.com/c/WrflWqct', '6b6ff847-260d-42ac-85ce-f55bb91471fe', true, false, true, true, 2, 0, NULL, 0, '2a1fec1a-67bf-4399-8926-6340b619b561', '', false, false, false, false, '2026-07-20', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('6f5c1513-1ef9-478c-ade2-7ac99bcd392a', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'b19cca69-3f8c-4e00-929a-58df124275bc', 'Calcomanías', 2, 8, 3, 'calcomanías', 'completado', '2026-06-29', '2026-06-26 21:18:16.906003+00', NULL, 'Diseño', '2026-06-26', 5, NULL, 'acb07989-8149-4e23-a1dc-684a9c0da0c3', false, true, false, false, 2, 0, NULL, 0, 'd60cb50a-2f1c-4507-b44b-fe2061709151', '', false, false, false, true, '2026-06-29', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('408e029f-841c-408e-9032-3e5c97473a86', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'RECAP', 3, 8, 5, 'Lleva gif', 'completado', '2026-07-06', '2026-07-06 19:37:36.947566+00', NULL, 'Copy Diseño Animación', '2026-07-06', 1, NULL, '7424c891-ad9a-4f6a-9007-f6a987bbbc36', true, false, true, true, 2, 0, NULL, 0, '5635592c-c6aa-4213-9ba8-b66eece5f7b9', '', false, false, false, true, '2026-07-06', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('bdc82950-3355-48bd-b2ea-0ab73c6781e3', '13b24dea-913b-4025-a4c2-b7a847a7401c', 'a6f75547-6426-469a-9248-1489a23c199d', 'Material para pacientes', 1, 8, NULL, 'Folder de papel con espacio para escribir, logo de Sazone y al interior stickers de cuidado.', 'pendiente', '2026-07-15', '2026-07-15 16:38:28.512001+00', NULL, '', '2026-07-15', 1, 'https://trello.com/c/48ggLkTx', '29b63c79-489b-4b71-9e5a-a0714f5714ac', true, false, false, false, 2, 0, NULL, 0, '808ca2a5-036d-458a-ac78-8cea9a6770c2', '', false, false, false, false, NULL, NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('443b6bf9-088c-432c-8ff6-b9c0d9bfe6ee', 'cc94bd16-dacd-45e0-a8fd-87f977b9cd4e', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', 'Prueba23', 3, 1, 2, 'edasdsdsdad', 'completado', '2026-07-16', '2026-07-16 23:27:36.837549+00', NULL, '', '2026-07-16', 1, NULL, '08594b7f-f383-464f-bacc-5696bc49f123', false, false, false, false, 2, 0, NULL, 0, '474c22dd-2339-4e8b-9139-56184f8dbb16', '', false, false, false, false, '2026-07-16', NULL, NULL, '2026-07-16 23:27:36.837549+00'),
	('ab5691c7-4dce-4e08-89f0-8dc4a669ae6f', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'VOTACIÓN PARTICIPANTES', 1, 5, 14, 'Participantes con Nombre / Foto / Descripción', 'completado', '2026-07-16', '2026-07-15 19:16:29.869273+00', NULL, '', '2026-07-15', 10, NULL, 'b6e72323-4995-4c70-a2db-6ba5a1d45998', true, false, false, false, 2, 0, NULL, 0, '02e40fcd-ea58-4627-a180-f2e711629f7e', '', false, false, false, false, '2026-07-16', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('00e8e07e-f82a-46db-ae39-6ae73966e8d3', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Comunicación ganadores reto Go Fluent', 2, 8, 5, 'Necesitamos desarrollar una felicitación para anunciar a los ganadores del reto goFLUENT.

Diseño
- Mantener el look & feel de la campaña goFLUENT.
-Utilizar un diseño atractivo y alineado con el concepto de aprendizaje y desarrollo.

Contenido
-Título de felicitación.
-Nombres, área y país de los tres ganadores.
-Mensaje breve de reconocimiento.', 'en_proceso', '2026-07-20', '2026-07-14 23:32:33.489455+00', NULL, '', '2026-07-14', 1, 'https://trello.com/c/I5pTvJH2', 'd8dedafd-64a8-49ab-9778-57e63bb5cdd9', true, false, false, true, 2, 0, NULL, 0, '3347adbf-6a4f-4e6a-b101-4b3da2bca113', '', false, false, false, false, '2026-07-20', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', '989c4298-86d3-416a-998f-2e82b3f9e553', 'Logotipo AMS', 2, 8, NULL, 'Logotipo AMS con estas características 
Formato: PNG
Dimensiones: 160 × 100 píxeles
Color: RGB', 'en_proceso', '2026-07-17', '2026-07-16 17:34:12.612489+00', NULL, '', '2026-07-16', 1, 'https://trello.com/c/v8VwFpNJ', 'a0d7aae1-dc06-42c7-a60b-e55a550f084a', true, false, false, false, 2, 0, NULL, 0, '372ec871-11c7-453b-ae00-430d32a33c66', '', false, false, true, false, '2026-07-17', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('289bddd0-68e5-4f8a-a238-237d9ff09d93', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Arte para mailing del Día de la Seguridad ', 2, 8, 4, 'Hacer imagen para mandar por correo a socios. ', 'en_proceso', '2026-07-16', '2026-07-15 20:26:40.834042+00', NULL, '', '2026-07-15', 1, NULL, 'da1cd3a3-c1ff-470d-a7e7-cbff77ed4980', true, false, false, false, 2, 0, NULL, 0, 'cb9e39c0-e982-4e93-abf7-6280cc5bb083', '', false, false, true, false, '2026-07-16', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('02a3a945-7dee-466e-b018-78e2c3c07a74', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', '989c4298-86d3-416a-998f-2e82b3f9e553', 'Diseñar la primera versión del programa', 1, 8, NULL, 'Por el momento, el diseño será genérico de AMS, hasta que aprueben la identidad definitiva.', 'en_proceso', '2026-07-17', '2026-07-16 20:46:22.985632+00', NULL, '', '2026-07-16', 2, 'https://trello.com/c/5sruZal2', 'c9c2b029-52fb-4164-8b00-5f9427de6698', true, false, false, false, 2, 0, NULL, 0, 'a562bdf0-57cf-48f0-95f7-fbb9bd01f8c5', '', false, false, true, false, '2026-07-17', NULL, NULL, '2026-07-16 20:46:22.985632+00'),
	('39814a11-6b11-44dc-bf31-a13902f75174', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', '989c4298-86d3-416a-998f-2e82b3f9e553', 'Actualizar base de datos para envío de newsletter', 3, 3, NULL, 'Actualizar la base de datos para el envío del newsletter para socios ', 'completado', '2026-07-16', '2026-07-16 19:00:44.828276+00', NULL, '', '2026-07-16', 1, 'https://trello.com/c/9b09M3uq', '7b9f6b6a-ff67-4c9d-b7d4-11c22ee1e48d', false, true, false, false, 2, 0, NULL, 0, '22175f1f-ae5a-41fb-a046-ffdb84972a0d', '', false, false, true, false, '2026-07-20', '2026-07-17 20:08:55.519+00', NULL, '2026-07-16 19:00:44.828276+00'),
	('f34a94ca-1292-4099-83c1-4e5765900b97', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Invitación examen Go Fluent', 2, 8, 5, 'Necesitamos diseñar una invitación para correo electrónico para invitar a los teammates a realizar su examen de nivel en Go Fluent.

El entregable debe ser llamativo, alineada al concepto Be Successful y mantener el look & feel de la campaña de mayo.

Incluir la fecha límite (15 de agosto) y un botón de llamada a la acción con espacio para agregar la liga de acceso.', 'completado', '2026-07-20', '2026-07-14 23:56:40.542502+00', NULL, '', '2026-07-14', 1, 'https://trello.com/c/fyLclKXl', 'd8dedafd-64a8-49ab-9778-57e63bb5cdd9', true, false, false, true, 2, 0, NULL, 0, '8464caca-d3ba-4ae3-aecb-db2e63243311', '', false, false, false, false, '2026-07-20', '2026-07-17 20:23:00.311+00', NULL, '2026-07-16 18:14:56.697588+00'),
	('c09acacf-b590-406a-9c82-4d192a98baa4', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', '4d21cc67-d670-4142-9620-032f0dcbecf0', 'Narrativa', 2, 8, 5, 'Agregar texto a la Narrativa:

Falsificación de medicamentos

 

El comercio ilegal de medicamentos, incluyendo falsificación, contrabando, robo, desvío y venta en canales no autorizados, representa un reto creciente para el sistema de salud en México, ya que pone en riesgo directo la seguridad de los pacientes y la confianza en los tratamientos. De acuerdo con estimaciones del IPN/ENCB, este mercado supera los $32 mil millones de pesos anuales, con un crecimiento estimado de 78% frente a 2019; además, en canales informales, hasta 6 de cada 10 medicamentos podrían ser robados, caducos o falsificados. La evidencia de COFEPRIS también muestra la magnitud del reto: en 2025 se identificaron 58 alertas sanitarias de medicamentos, y en el caso de productos de Novo Nordisk se han emitido alertas relacionadas con Rybelsus, Ozempic, Victoza, Wegovy, Saxenda y NovoSeven RT por falsificación y/o comercialización irregular. Frente a este contexto, Novo Nordisk México ha presentado alrededor de 20 denuncias sanitarias ante COFEPRIS desde 2023, mantiene monitoreo de canales físicos y digitales de riesgo, capacita a autoridades como Aduanas y COFEPRIS, impulsa campañas educativas e informativas, cuenta con un call center 24/7 para asesorar y recibir reportes sobre posibles productos sospechosos, y colabora con plataformas digitales como Mercado Libre, mediante su programa de Brand Protection, para combatir la comercialización irregular en línea.  

 

Acciones que estamos llevando a cabo:

Capacitación y colaboración con autoridades: como parte del despliegue 2026, a la fecha hemos capacitado a 126 funcionarios de Aduanas y 189 participantes de COFEPRIS. Continuamos con el plan de entrenar a más de 500 funcionarios de Aduanas en 10 ubicaciones del país; hasta ahora se han realizado sesiones en Ciudad de México, Guadalajara, Tijuana y, más recientemente, Querétaro.
Denuncias y respuesta institucional: Novo Nordisk México ha presentado alrededor de 20 denuncias sanitarias ante COFEPRIS desde 2023, relacionadas con posibles casos de falsificación, comercialización irregular y otros riesgos asociados a productos ilegítimos; adicionalmente, se han presentado denuncias ante Ministerio Público por hurto en Aduana AIFA y robo de mercancía en tránsito.
Monitoreo de mercados y canales de riesgo: mantenemos vigilancia sobre plataformas de venta en línea, redes sociales, aplicaciones de mensajería, tianguis y mercados, domicilios particulares y farmacias en zonas turísticas y fronterizas, donde se ha identificado riesgo de oferta o distribución de medicamentos ilegítimos.
Campañas educativas e informativas: impulsamos acciones de comunicación para orientar a pacientes, profesionales de la salud y otros actores relevantes sobre los riesgos de adquirir medicamentos fuera de canales autorizados, la importancia de verificar el origen del producto y los mecanismos disponibles para reportar sospechas.
Canales de atención y reporte: contamos con un call center 24/7 para brindar asesoría, recibir reportes o denuncias sobre posibles productos sospechosos y canalizar los casos para su revisión y seguimiento correspondiente.
Colaboración con plataformas digitales: trabajamos con Mercado Libre a través de su programa de Brand Protection, con el objetivo de identificar, reportar y solicitar la baja de publicaciones que puedan estar relacionadas con la comercialización irregular o no autorizada de productos Novo Nordisk.', 'en_proceso', '2026-07-15', '2026-07-15 18:45:51.433345+00', NULL, '', '2026-07-15', 2, NULL, '89a15c56-a0a7-4137-8900-1dd3211441a4', true, false, false, false, 2, 0, NULL, 0, 'f518c929-7eb1-4bb6-b55f-677b733cb14a', '', false, false, false, false, '2026-07-15', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('176a391a-f55d-4976-b457-91e95299f432', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'PUERTAS PISO 5 CHIVAS', 1, 14, 4, 'Puertas oficina', 'completado', '2026-07-16', '2026-07-16 20:50:36.147529+00', NULL, '', '2026-07-16', 1, NULL, '0d9b9b49-e8b5-4e65-8e12-8d0a98626a26', true, false, false, false, 2, 0, NULL, 0, 'bc416e42-90fd-435b-89b1-b4f93503cec2', '', false, false, false, false, '2026-07-16', NULL, NULL, '2026-07-16 20:50:36.147529+00'),
	('31f7f6d6-a505-450b-a23d-73e5f2a72a15', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'FORMS VOTACIÓN', 1, 13, 6, 'Crear forms con los 20 participantes para votación + QR del link', 'completado', '2026-07-15', '2026-07-15 19:19:38.856924+00', NULL, '', '2026-07-15', 1, NULL, 'b6e72323-4995-4c70-a2db-6ba5a1d45998', false, true, false, false, 2, 0, NULL, 0, 'e0429c10-a0cd-4342-b12c-fee36be0e232', '', false, false, false, false, '2026-07-15', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('6cecc3b5-13a1-43c0-97f6-e9ccfb4b7e04', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'ADT GANADORAS Y NO GANADORAS', 2, 8, 5, 'Comunicado para Ganadoras
Comunicado para no Ganadoras
Pases extra por slack', 'completado', '2026-07-15', '2026-07-15 19:49:39.140984+00', NULL, '', '2026-07-15', 3, NULL, '545250ce-af3b-4b74-9537-faf4d966a205', false, false, false, false, 2, 0, NULL, 0, '5635592c-c6aa-4213-9ba8-b66eece5f7b9', '', false, false, false, false, '2026-07-15', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('74818bb1-35cc-4918-8738-37d66cb07958', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'b19cca69-3f8c-4e00-929a-58df124275bc', 'Comunicación LOTO', 2, 8, 5, 'la principal problemática es que hay alguna pareas (principalmente mantenimiento) que están utilizando los candados de LOTO como candados normales para sus cajas o gavetas de herramientas. Actualmente el equipo de seguridad ya hizo un recorrido para localizar el mal uso de estos candados, retirarlos y sustituirlos por candados normales; y así poder rescatar los candados de LOTO.

 
Lo que sigue es comunicación para reforzar el uso correcto de los candados de LOTO.

¿Por qué es importante el uso correcto de los candados LOTO?

Sirven para bloquear las máquinas que están desenergizadas. De esta manera las personas pueden saber que esa máquina está detenida por algún tema de mantenimiento, reparación, etc; y que por ningún motivo deben encenderla.
Estos candados están fabricados con un material especializados para su función, evita conductividad
Son parte de requerimientos corporativos, así como de la Secretaría de Trabajo.
 

El objetivo es concientizar sobre el uso correcto (o incorrecto) al personal de piso de producción (mantenimiento, principalmente) mediante: material para pantallas, stickers y posters.


Todavía no tengo la información de el lugar en donde serán pegadas las stickers.', 'completado', '2026-07-06', '2026-07-01 16:28:36.608867+00', NULL, 'RRHH/ Seguridad', '2026-07-01', 1, NULL, '143440d5-e301-4b78-90c2-f9df382ee990', false, false, false, false, 2, 0, NULL, 0, '2a1fec1a-67bf-4399-8926-6340b619b561', '', false, false, false, true, '2026-07-06', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('abb14592-d6b2-418e-b27c-15c294ea56f7', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'Sesiones', 1, 8, 5, 'Miércoles 8 de julio 11:00a.m. – 12:00 p.m.

 

https://nike.zoom.us/j/96150939074?pwd=cn6WSqPu2qxWK3SUAbUp4pQoLZHtvf.1&from=addon

 

Meeting URL: 

https://nike.zoom.us/j/96150939074?pwd=cn6WSqPu2qxWK3SUAbUp4pQoLZHtvf.1&from=addon

Meeting ID: 

961 5093 9074

Passcode:

348240

 

 

Martes 14 de julio 3:00p.m. – 4:00 p.m.

 

https://nike.zoom.us/j/95146641726?pwd=bXr41djeEamT2wChURSZqneAWUZqac.1&from=addon

 

Meeting URL: 

https://nike.zoom.us/j/95146641726?pwd=bXr41djeEamT2wChURSZqneAWUZqac.1&from=addon

Meeting ID: 

951 4664 1726

Passcode:

788258', 'completado', '2026-07-06', '2026-07-06 19:34:32.289375+00', NULL, 'Copy y diseño', '2026-07-06', 12, NULL, '66a841ca-9550-471f-a3bc-1658121a8702', true, false, false, true, 2, 0, NULL, 0, '5635592c-c6aa-4213-9ba8-b66eece5f7b9', '', false, false, false, true, '2026-07-06', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('c21a1899-5eb5-42e5-8aba-8623818a3b31', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'Apoyo Venezuela', 3, 8, 5, 'Varios links', 'completado', '2026-07-06', '2026-07-06 19:36:31.061074+00', NULL, 'Copy Diseño Programacion', '2026-07-06', 1, NULL, '454dff24-b70e-4a33-b68f-6ea303b8f088', true, true, false, true, 2, 0, NULL, 0, '5635592c-c6aa-4213-9ba8-b66eece5f7b9', '', false, false, false, true, '2026-07-06', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('f15fe755-410c-440a-9e06-3b47b4e91a83', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', 'b19cca69-3f8c-4e00-929a-58df124275bc', 'Animación en pantallas', 2, 12, 19, 'Animaciones en las pantallas', 'completado', '2026-06-29', '2026-06-26 21:17:05.141627+00', NULL, 'Diseño', '2026-06-26', 1, NULL, 'acb07989-8149-4e23-a1dc-684a9c0da0c3', false, true, false, false, 2, 0, NULL, 0, 'cafa6191-f1bd-4f61-a6a9-b6910d730200', '', false, false, false, true, '2026-06-29', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('52d1786a-e589-4857-8919-7502dbe420c6', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', '244-7 de julio', 1, 8, 13, 'temas', 'completado', '2026-07-07', '2026-07-06 19:39:46.852374+00', NULL, 'Contenido, diseño, Programacion, animaciónn', '2026-07-06', 1, NULL, 'fe648596-6545-42a2-9694-8187eee85fc9', true, true, true, true, 2, 0, NULL, 0, '836179b0-67e7-47de-88ce-a6cb4ef477c4', '', false, false, false, true, '2026-07-07', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('469eabab-3da3-4914-8e22-dfef7cbe2bd4', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'cc5d4b45-dd70-48d5-9cbe-3eb98539ac15', 'Votación', 3, 8, 5, 'Votacion por el par que representará a Latinoamerica', 'completado', '2026-07-10', '2026-07-10 23:07:51.340109+00', NULL, '', '2026-07-10', 2, NULL, 'b6e72323-4995-4c70-a2db-6ba5a1d45998', true, false, false, true, 2, 0, NULL, 0, '5635592c-c6aa-4213-9ba8-b66eece5f7b9', '', false, false, false, true, '2026-07-10', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('b7e0ea0b-102d-4606-84dd-0106e325b570', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', '245', 1, 8, 5, 'Status de Semifinales: Francia vs España y pendiente de confirmar Noruega o Inglaterra.

Scorpion Pack: Mercurial Vapor y Mercurial Superfly status de Semifinales: Francia vs España y pendiente de confirmar Noruega o Inglaterra.

Scorpion Pack: Mercurial Vapor y Mercurial Superfly Nike presenta: “Mercurial Scorpion”

El Events Guidance Committee (EGC)

Campeones Nike si gana Sinner en Winbledon

6: Venezuela GYB', 'completado', '2026-07-14', '2026-07-10 23:14:18.532253+00', NULL, '', '2026-07-10', 1, NULL, 'fe648596-6545-42a2-9694-8187eee85fc9', true, true, true, true, 2, 0, NULL, 0, '5635592c-c6aa-4213-9ba8-b66eece5f7b9', '', false, false, false, true, '2026-07-14', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('b5c868b4-829b-4a06-833c-f86333fe605b', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', 'cc5d4b45-dd70-48d5-9cbe-3eb98539ac15', 'Dinámicas Giveaways', 2, 3, 5, '100 GIVEAWAYS RIP THE SCRIPT', 'completado', '2026-07-13', '2026-07-10 23:10:25.974181+00', NULL, '', '2026-07-10', 1, NULL, '0f360111-6541-4ae5-9c4d-40be7e6c9cef', false, false, false, true, 2, 0, NULL, 0, '9c557820-ee06-4f06-a839-2ee7b846607d', '', false, false, false, true, '2026-07-13', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('d9afdbee-a381-49b5-8891-865e8048df42', '97919df1-eafd-4bdc-9d0d-5e52e8c730db', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Newsletter semanal ', 1, 6, 6, 'El news de la semana incluye dos notas:
1)  Boletín informativo liquidez (Publicación 3 de julio 2026)
2) Anexo AA Formatos para la remisión de información a la CNBV (publicación 7 de julio 2026)
', 'completado', '2026-07-15', '2026-07-15 19:44:04.307593+00', NULL, '', '2026-07-15', 1, 'https://trello.com/c/1qvSgs1C', '7b9f6b6a-ff67-4c9d-b7d4-11c22ee1e48d', false, true, false, true, 2, 0, NULL, 1, '4c277094-a1cf-456d-8035-daf962a4a7c9', '', false, false, true, false, '2026-07-15', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('a151ae32-6aaa-49a9-b6f9-9daf20fd9d43', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'Instrucciones para ADT 50%', 2, 8, 5, 'Introducción y pasos:
Recibirás un correo de Let''s Do This con el asunto "Reclama tu lugar en Nike After Dark Tour - Mexico City".
Dentro del correo encontrarás el botón “Inscríbete ahora". Dar clic y completar los campos solicitados.
Una vez que hayas iniciado sesión y completado tu información, asegúrate de seleccionar "Continuar" para avanzar al proceso de pago.
El 50% de descuento se aplicará automáticamente, por lo que no necesitarás ingresar ningún código promocional.
Al finalizar el proceso, recibirás un correo de Nike After Dark Tour confirmando tu inscripción.

Importante: Tendrás hasta el [FECHA POR DEFINIR] para completar tu registro. Si no se completa dentro de este periodo, tu lugar podrá ser asignado a otra empleada interesada. 
(La fecha dependerá de cuando salgamos con este comunicado, considerando que tenemos que seleccionar a las 5 empleadas antes, ya que es muy probable que sean algunas de las que cuentan con este descuento)  

Si tienen alguna duda o necesitan apoyo durante el proceso, pueden contactar a sofia.vazquez@nike.com.', 'completado', '2026-07-07', '2026-07-07 00:55:51.535378+00', NULL, 'Contenido Diseño', '2026-07-07', 1, NULL, '545250ce-af3b-4b74-9537-faf4d966a205', true, false, false, true, 2, 0, NULL, 0, '5635592c-c6aa-4213-9ba8-b66eece5f7b9', '', false, false, false, true, '2026-07-07', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('5338889e-badf-4b6f-abaf-b0889db71658', 'ac60d1b6-b9ea-4725-af11-f7ee16128eba', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', 'Comunicado Aviso External Support Analyst', 1, 8, 5, 'Asunto: Aviso 

Estimados colaboradores,
Les informamos que la asignación de Elizabeth Santamaría como External Support Analyst (Procurement) dentro de los servicios especializados ha concluido.
Les pedimos su apoyo para que, en este periodo de transición, cualquier tema puedan resolverlo con Mariana Bernal (NMBB).', 'en_proceso', '2026-07-17', '2026-07-16 19:37:42.204499+00', NULL, '', '2026-07-16', 1, NULL, '89a15c56-a0a7-4137-8900-1dd3211441a4', true, false, false, true, 2, 0, NULL, 0, '26f5811f-41b7-4d88-9ce5-45592d5f3020', '', false, false, false, false, '2026-07-17', NULL, NULL, '2026-07-16 19:37:42.204499+00'),
	('32b61433-ed15-47eb-bdab-b1ab77a6c432', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Tips 5s julio', 2, 8, 4, 'Hola, team.
Con la información que viene en la imagen, debemos realizar un comunicado que será enviado por mail; además, debemos adaptarlo a pantallas.', 'completado', '2026-07-20', '2026-07-14 23:46:18.760743+00', NULL, '', '2026-07-14', 1, 'https://trello.com/c/WrflWqct', '6b6ff847-260d-42ac-85ce-f55bb91471fe', false, false, false, true, 2, 0, NULL, 0, 'b3b536ef-8d69-4cd5-8424-ededf5153140', '', false, false, false, false, '2026-07-20', '2026-07-16 23:13:00.811+00', NULL, '2026-07-16 18:14:56.697588+00'),
	('2dc92d52-5d88-4481-8b3e-b931d11fb4ee', '3d026c49-2360-4262-a900-aaeac26ebd0a', '2072a09e-3804-447f-a7f5-efacc0589e83', 'Visualización del micrositio ', 1, 13, 6, 'Visualización del micrositio con el L&F del Informe ', 'en_proceso', '2026-07-17', '2026-07-16 01:22:06.53022+00', NULL, '', '2026-07-16', 1, 'https://trello.com/c/gcZI6T2S', 'ad899474-fc36-4cc9-a3ac-ea01ab5f89e6', false, true, false, true, 2, 0, NULL, 7, '3205fd6d-82a4-4b28-849c-8bf389079365', '', false, false, true, false, '2026-07-16', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('a171a42c-aa21-405c-a213-4a654ab8ad99', '7685e766-8085-4947-ab3b-03d86900428c', '403debcb-7c38-4145-a9ca-3390e1f2b7cd', 'DEL 20-24 DE JULIO', 2, 8, 4, '5 pantallas 2 infografias', 'en_proceso', '2026-07-16', '2026-07-15 19:12:02.700832+00', NULL, '', '2026-07-15', 10, NULL, 'c9ae17f2-ec80-4603-abea-fe27591e53fd', true, false, false, false, 2, 0, NULL, 0, '9d15bf8f-cb69-4623-9d95-1e7474c80991', '', false, false, false, false, '2026-07-16', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('a3762086-5db2-47ec-b6e1-01d69e87c072', 'deb472a1-6ab3-43e1-8213-c3c22ac6c100', '8caa4432-c8a5-44fa-bdad-e38613f029e1', 'Master Graphic Associate Experience', 2, 8, 4, 'Desarrollar dos caminos de master graphic para presentar al team GB. Se presenta: logo, paleta de colores y ejemplo de aplicación. Ya que esté aprobado, se realizarán las bajadas del listado de entregables.', 'pendiente', '2026-07-30', '2026-07-16 23:02:09.894431+00', NULL, '', '2026-07-16', 2, 'https://trello.com/c/8fHMTAVp', 'cf5a02dd-9289-48f0-86ab-e5225553c9e0', false, false, false, false, 2, 0, NULL, 0, 'b656eed2-2396-449d-b3f6-a9ba8e6904af', 'karla.heras@grupobimbo.com', false, false, false, true, '2026-07-30', NULL, NULL, '2026-07-16 23:02:09.894431+00'),
	('155502e6-f2ad-4057-a870-430f718b9cf0', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Sesiones de Salud y Vida', 2, 8, 5, 'Necesitamos diseñar una invitación editable en formato PPTX para enviar por correo electrónico para Costa Rica

Tema: Sesión informativa "Seguro de Salud y Vida".   Serán sesiones para conocer al nuevo bróker en Trading y hacer una breve sesión de refrescamiento de las pólizas

La plantilla debe incluir espacios editables para:

Fecha de la sesión (el programa inicia el 11 de agosto).

Hora.

Botón para insertar la liga de acceso a cada sesión.

La invitación será utilizada para distintas sesiones, por lo que la información de fecha, hora y enlace debe poder actualizarse fácilmente.

Fechas

Martes 11 de agosto, Miércoles 12 de agosto, Jueves 13 de agosto.
', 'en_proceso', '2026-07-20', '2026-07-16 20:45:37.349182+00', NULL, '', '2026-07-16', 1, 'https://trello.com/c/Y2ql52D2', '0d086f4d-dc15-4865-8588-cbc18ff21b6f', true, false, false, true, 2, 0, NULL, 0, '8464caca-d3ba-4ae3-aecb-db2e63243311', '', false, false, false, false, '2026-07-20', NULL, NULL, '2026-07-16 20:45:37.349182+00'),
	('f8df0959-d0bb-4218-a3e0-c368667e1e8c', 'a95017b0-0966-4cb5-ba6e-d1c5f80f3bb1', '39181f00-f70d-454a-ab49-d2612488e8f2', 'ADT PARTICIPANTES BIBS', 2, 5, 14, 'Colocar a las participantes de los Bibs con videos y preguntas para jueces', 'completado', '2026-07-15', '2026-07-15 19:51:27.785903+00', NULL, '', '2026-07-15', 4, NULL, '545250ce-af3b-4b74-9537-faf4d966a205', true, false, false, false, 2, 0, NULL, 1, '02e40fcd-ea58-4627-a180-f2e711629f7e', '', false, false, false, false, '2026-07-15', NULL, NULL, '2026-07-16 18:14:56.697588+00'),
	('22f64b33-fbe4-4da8-ae5f-b7aac0342a12', '8e0aefb1-a0dd-455d-aeca-5654b8e25c63', '3cfa4e52-9775-4fd9-bc3a-71acb29748a3', 'Invitación examen Go Fluent', 2, 8, 4, 'Necesitamos diseñar una invitación para correo electrónico para invitar a los teammates a realizar su examen de nivel en Go Fluent.

El entregable debe ser llamativo, alineada al concepto Be Successful y mantener el look & feel de la campaña de mayo.

Incluir la fecha límite (15 de agosto) y un botón de llamada a la acción con espacio para agregar la liga de acceso.', 'completado', '2026-07-20', '2026-07-14 23:42:01.775909+00', NULL, '', '2026-07-14', 1, 'https://trello.com/c/fyLclKXl', 'd8dedafd-64a8-49ab-9778-57e63bb5cdd9', false, false, false, true, 2, 0, NULL, 0, '37672a50-5c59-4b0d-862c-828a3ed65ccf', '', false, false, false, false, '2026-07-20', '2026-07-17 20:24:38.566+00', NULL, '2026-07-16 18:14:56.697588+00');


--
-- Data for Name: request_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: request_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."request_files" ("id", "request_id", "storage_path", "file_type", "uploader_id", "created_at") VALUES
	('d4ced699-6d29-42aa-8847-bbe66caf091f', '00e8e07e-f82a-46db-ae39-6ae73966e8d3', 'https://trello.com/c/I5pTvJH2', 'input', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-14 23:32:33.831133+00'),
	('ba2bcbe0-93f4-4d99-a73c-5260aaeab547', '22f64b33-fbe4-4da8-ae5f-b7aac0342a12', 'https://trello.com/c/fyLclKXl', 'input', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-14 23:42:01.96213+00'),
	('f75637b7-7875-40bb-9e3c-1ff5467e75d3', '32b61433-ed15-47eb-bdab-b1ab77a6c432', 'https://trello.com/c/WrflWqct', 'input', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-14 23:46:19.080099+00'),
	('7639c9ef-8387-45d0-aee9-4455ec4cc432', 'd45c7e7c-02ec-4d6d-9053-82199ead5f88', 'https://trello.com/c/WrflWqct', 'input', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-14 23:51:40.012525+00'),
	('6f93e64f-a896-4d1a-9ba2-253e64c37364', 'f34a94ca-1292-4099-83c1-4e5765900b97', 'https://trello.com/c/fyLclKXl', 'input', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-14 23:56:40.686065+00'),
	('0960a9a5-de0b-4753-8910-9fbe7b345cf1', 'bdc82950-3355-48bd-b2ea-0ab73c6781e3', 'https://trello.com/c/48ggLkTx', 'input', 'f018a13c-779a-4435-92c2-53b133c2a72d', '2026-07-15 16:38:28.750576+00'),
	('e45f9c91-6c86-472f-a995-f884faf3fabf', 'd9afdbee-a381-49b5-8891-865e8048df42', 'https://trello.com/c/1qvSgs1C', 'input', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-15 19:44:04.536119+00'),
	('ce3629a1-47b8-4a46-97d4-b1540f547ffe', '2dc92d52-5d88-4481-8b3e-b931d11fb4ee', 'https://trello.com/c/gcZI6T2S', 'input', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 01:22:06.740514+00'),
	('2986468f-b8ca-45d6-ae1d-d1dce0aa6fc5', 'ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', 'https://trello.com/c/v8VwFpNJ', 'input', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 17:34:12.796601+00'),
	('b59c3296-4651-4e9c-a076-6e0503259446', '39814a11-6b11-44dc-bf31-a13902f75174', 'https://trello.com/c/9b09M3uq', 'input', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 19:00:45.030054+00'),
	('80ea01e3-6928-44b3-9e68-cd6100d88e05', 'c56f1367-cd03-45c2-aac9-dda4966ac3b8', 'https://trello.com/c/JRpkQtYI', 'input', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-16 20:00:49.375543+00'),
	('3e48fe79-1cbc-409c-a37b-2359a28bda46', '155502e6-f2ad-4057-a870-430f718b9cf0', 'https://trello.com/c/Y2ql52D2', 'input', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-16 20:45:37.51751+00'),
	('90b5fc64-987a-4096-9731-45ed07d3ad35', '02a3a945-7dee-466e-b018-78e2c3c07a74', 'https://trello.com/c/5sruZal2', 'input', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 20:46:23.393664+00'),
	('580d11bd-27ac-4294-99d4-e8d92a77fec3', 'a3762086-5db2-47ec-b6e1-01d69e87c072', 'https://trello.com/c/8fHMTAVp', 'input', '6901712f-b020-4eec-83eb-13d1eff277c0', '2026-07-16 23:02:10.16074+00');


--
-- Data for Name: request_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."request_tasks" ("id", "request_id", "discipline", "assigned_to", "status", "quantity", "deliverable_url", "delivery_notes", "created_at", "updated_at", "coordinator_notes") VALUES
	('6dac35ba-3624-4357-94d9-f1098441ba4d', '408e029f-841c-408e-9032-3e5c97473a86', 'Diseño', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:41:22.390671+00', '2026-07-08 15:41:22.390671+00', NULL),
	('9c3edef4-dade-4c32-894b-2126a828e9a0', 'c21a1899-5eb5-42e5-8aba-8623818a3b31', 'Diseño', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:40:52.746593+00', '2026-07-08 15:40:52.746593+00', NULL),
	('a5ed18ed-7dd0-4342-8c44-5f4596769734', 'c2b959bd-82ea-4fae-b0a1-9bd9b52602bb', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:42:16.078605+00', '2026-07-08 15:42:16.078605+00', NULL),
	('e11f8941-86ff-480f-8f39-b0d98e72ad61', 'a151ae32-6aaa-49a9-b6f9-9daf20fd9d43', 'Diseño', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:42:27.638028+00', '2026-07-08 15:42:27.638028+00', NULL),
	('a22b3136-7f90-452a-af2e-7e6ef8996291', 'a151ae32-6aaa-49a9-b6f9-9daf20fd9d43', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:42:27.792888+00', '2026-07-08 15:42:27.792888+00', NULL),
	('3e6037b6-4af5-4f87-878b-bb7beff6ebd0', '52d1786a-e589-4857-8919-7502dbe420c6', 'Programación', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:41:39.526465+00', '2026-07-08 15:41:39.526465+00', NULL),
	('12141043-fdd8-4133-bef6-badac4fa07bb', '52d1786a-e589-4857-8919-7502dbe420c6', 'Audiovisual', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:41:39.658597+00', '2026-07-08 15:41:39.658597+00', NULL),
	('6aee029a-e768-4c08-afc7-c4c20737ec73', '52d1786a-e589-4857-8919-7502dbe420c6', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:41:39.82741+00', '2026-07-08 15:41:39.82741+00', NULL),
	('a339e401-53d8-4d2c-95c2-347573fa62ea', '408e029f-841c-408e-9032-3e5c97473a86', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:41:22.715607+00', '2026-07-08 15:41:22.715607+00', NULL),
	('18a59ecc-83f9-4dca-a44c-647947b82bf5', 'c21a1899-5eb5-42e5-8aba-8623818a3b31', 'Programación', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:40:52.895192+00', '2026-07-08 15:40:52.895192+00', NULL),
	('d1892dc6-5d64-4bf9-a9b4-ec87553363f5', 'c21a1899-5eb5-42e5-8aba-8623818a3b31', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:41:28.555645+00', '2026-07-08 15:41:28.555645+00', NULL),
	('18369316-e24c-4e40-8e07-a1022e41a5af', '6f5c1513-1ef9-478c-ade2-7ac99bcd392a', 'Programación', '{0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb,17d5d747-fdd1-4d4f-88cc-aa2909995088}', 'entregado', 1, 'https://gemini.google.com/gem/a279782b34da?usp=sharing', '[AVANCE CREADOR]: daascasdasdadasdasdas

[FILTRO INTERNO]:
ysisekiere irrrrrrrrrrrrrrrrr

[AVANCE CREADOR]: ok va

[FILTRO INTERNO]:
ok

[AVANCE CREADOR]: okkk

[FILTRO INTERNO]:
nambre haslo bien pa

[AVANCE CREADOR]: ok si perdon', '2026-07-08 16:59:14.93656+00', '2026-07-08 16:59:14.93656+00', 'echele mi yaki '),
	('cda427cf-fe65-4443-9cc7-f1e482b89bc4', '408e029f-841c-408e-9032-3e5c97473a86', 'Audiovisual', '{}', 'pendiente', 1, NULL, NULL, '2026-07-08 15:41:22.538907+00', '2026-07-08 15:41:22.538907+00', NULL),
	('8a1978ad-d7dc-4fa6-90fd-df74016bfe33', 'abb14592-d6b2-418e-b27c-15c294ea56f7', 'Contenido', NULL, 'pendiente', 1, NULL, NULL, '2026-07-08 18:11:30.131247+00', '2026-07-08 18:11:30.131247+00', NULL),
	('ca64dd3c-d93a-4b27-9584-994766822333', 'f15fe755-410c-440a-9e06-3b47b4e91a83', 'Programación', '{0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb,17d5d747-fdd1-4d4f-88cc-aa2909995088}', 'aprobado_interno', 1, 'http://localhost:5173/colaborador', '[AVANCE CREADOR]: vvaaaaaa

[FILTRO INTERNO]:
echele

[AVANCE CREADOR]: vaaaaa

[FILTRO INTERNO]:
ola

[AVANCE CREADOR]: Re-entrega de material sin comentarios.', '2026-07-08 18:27:48.646179+00', '2026-07-08 18:27:48.646179+00', 'echenle mis cabrones'),
	('312f6ffe-55b1-44c4-af9b-4fc132fcb524', '469eabab-3da3-4914-8e22-dfef7cbe2bd4', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-10 23:08:13.535968+00', '2026-07-10 23:08:13.535968+00', NULL),
	('264ba86b-3dd6-4a6c-884a-63a62e5d444e', '31f7f6d6-a505-450b-a23d-73e5f2a72a15', 'Programación', '{}', 'pendiente', 1, NULL, NULL, '2026-07-15 19:19:46.453917+00', '2026-07-15 19:19:46.453917+00', NULL),
	('a0b9e71b-ed02-4731-aa96-c898e336114e', 'b7e0ea0b-102d-4606-84dd-0106e325b570', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-10 23:14:37.458181+00', '2026-07-10 23:14:37.458181+00', NULL),
	('7b04288e-39bb-489e-9f41-ab5b4af97690', 'b7e0ea0b-102d-4606-84dd-0106e325b570', 'Audiovisual', '{}', 'pendiente', 1, NULL, NULL, '2026-07-10 23:14:38.032837+00', '2026-07-10 23:14:38.032837+00', NULL),
	('daabc869-a7a9-4682-9f96-70f7cba6ce7a', 'b7e0ea0b-102d-4606-84dd-0106e325b570', 'Programación', '{}', 'pendiente', 1, NULL, NULL, '2026-07-10 23:14:38.313128+00', '2026-07-10 23:14:38.313128+00', NULL),
	('a94fe95e-6447-49e4-94c2-1f02f441e21c', '289bddd0-68e5-4f8a-a238-237d9ff09d93', 'Diseño', '{83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a}', 'entregado', 1, 'https://trello.com/c/OVLizGh1/680-mailing-security-day', '', '2026-07-15 20:28:33.842238+00', '2026-07-16 21:02:18.379+00', NULL),
	('ebfebb2e-4f34-464a-8c80-b229a65a2223', 'f34a94ca-1292-4099-83c1-4e5765900b97', 'Diseño', '{897e2dd9-2646-4d9e-a20d-f40da228e85e}', 'aprobado', 1, NULL, NULL, '2026-07-15 00:24:20.178714+00', '2026-07-15 00:24:20.178714+00', NULL),
	('da3d20b2-0f62-4703-af33-8ce764f1cb53', 'b7e0ea0b-102d-4606-84dd-0106e325b570', 'Diseño', '{}', 'aprobado_interno', 1, 'https://trello.com/c/7vcXKfS0/309-ldp245?search_id=1771ce4c-ad9b-4b5d-91ee-b596f43cc0a5', '', '2026-07-10 23:14:37.744397+00', '2026-07-15 19:06:42.566+00', NULL),
	('2a280313-a43a-4964-9898-2e6875da20a6', 'd9afdbee-a381-49b5-8891-865e8048df42', 'Contenido', '{}', 'aprobado_interno', 1, 'https://trello.com/c/1qvSgs1C/678-news-ams-13-julio', '🚨 NUEVAS CORRECCIONES REGISTRADAS:
• [FILTRO AGENCIA]: Se cambió la redacción del newsletter porque eran dos notas diferentes

', '2026-07-15 19:45:25.976556+00', '2026-07-16 01:08:46.544+00', NULL),
	('0528ab6b-ab7f-4eb8-8f80-61333022b962', 'bdc82950-3355-48bd-b2ea-0ab73c6781e3', 'Diseño', '{}', 'pendiente', 1, NULL, NULL, '2026-07-15 19:06:58.963416+00', '2026-07-15 19:06:58.963416+00', NULL),
	('a090f56c-dd81-4531-988e-a3c049d8b460', 'ab5691c7-4dce-4e08-89f0-8dc4a669ae6f', 'Diseño', '{9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a}', 'pendiente', 1, NULL, NULL, '2026-07-15 19:16:42.651701+00', '2026-07-15 19:16:42.651701+00', NULL),
	('1eb45f14-0307-4737-860e-c0fcf97f88a9', 'f8df0959-d0bb-4218-a3e0-c368667e1e8c', 'Diseño', '{83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a}', 'con_correcciones', 1, 'https://trello.com/c/ByAovUPn/307-plan-adt-5bib?search_id=013c4187-b69b-4658-8c04-ae1a36fd3b71', '🚨 NUEVAS CORRECCIONES REGISTRADAS:
• [FILTRO CLIENTE]: Se gregaron mas competidoras', '2026-07-15 19:53:53.56799+00', '2026-07-15 19:54:27.054+00', NULL),
	('26068630-7496-4327-ad7d-9267460879b5', 'd9afdbee-a381-49b5-8891-865e8048df42', 'Programación', '{}', 'aprobado_interno', 1, 'https://www.youtube.com/', '[ENTREGA COLABORADOR]:
Listo', '2026-07-15 19:45:46.759884+00', '2026-07-16 01:04:17.127+00', NULL),
	('dc83681e-4ea8-4012-a463-3e86795e907c', '289bddd0-68e5-4f8a-a238-237d9ff09d93', 'RP', '{2072a09e-3804-447f-a7f5-efacc0589e83}', 'pendiente', 1, NULL, NULL, '2026-07-15 20:28:34.245443+00', '2026-07-15 20:28:34.245443+00', 'Diseñar imagen para invitación al Security Day con identidad AMS
El contenido ya está listo: https://trello.com/c/OVLizGh1'),
	('2875dfa3-0607-4b09-8890-77a3d9bc2340', '52d1786a-e589-4857-8919-7502dbe420c6', 'Diseño', '{83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a}', 'aprobado_interno', 1, 'https://trello.com/c/SEAkdc1k/308-ldp-244?search_id=1c235630-5cd2-4b90-b5cf-7b9a349797d1', '', '2026-07-08 15:41:39.372085+00', '2026-07-08 15:44:03.62+00', NULL),
	('9af1d207-c1cd-4db0-a5ec-f389df440af2', '00e8e07e-f82a-46db-ae39-6ae73966e8d3', 'Contenido', '{f018a13c-779a-4435-92c2-53b133c2a72d}', 'aprobado_interno', 1, 'https://trello.com/c/I5pTvJH2', '', '2026-07-14 23:35:27.61172+00', '2026-07-15 17:51:14.022+00', NULL),
	('9598623e-a48e-4f7e-b716-cd17f2010d82', 'a171a42c-aa21-405c-a213-4a654ab8ad99', 'Diseño', '{000ed70a-a668-4379-82c6-a82e7d523543}', 'entregado', 1, 'https://trello.com/c/TdjAQqOd/230-pantallas-del-20-al-24-de-julio', '[AVANCE CREADOR]: Re-entrega de material sin comentarios.', '2026-07-15 19:12:45.512184+00', '2026-07-15 19:12:45.512184+00', NULL),
	('1efac4be-158a-4992-9492-42b830f0873b', 'd45c7e7c-02ec-4d6d-9053-82199ead5f88', 'Diseño', '{}', 'pendiente', 1, NULL, NULL, '2026-07-15 00:24:59.847885+00', '2026-07-15 00:24:59.847885+00', NULL),
	('2bde7447-9083-4474-8ede-865ccc56953b', 'd45c7e7c-02ec-4d6d-9053-82199ead5f88', 'Audiovisual', '{}', 'pendiente', 1, NULL, NULL, '2026-07-15 00:25:00.108493+00', '2026-07-15 00:25:00.108493+00', NULL),
	('a85a7556-7d6c-4527-8e25-814985aec313', '469eabab-3da3-4914-8e22-dfef7cbe2bd4', 'Diseño', '{83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a}', 'aprobado_interno', 1, 'https://trello.com/c/1fLScVKi/311-nike-by-you-votaci%C3%B3n?search_id=7999792e-2191-426c-bce9-e2f86f8fa106', '', '2026-07-10 23:08:13.816236+00', '2026-07-15 19:23:15.105+00', NULL),
	('a3868554-3f75-4462-b52a-dc27c2710c24', '00e8e07e-f82a-46db-ae39-6ae73966e8d3', 'Diseño', '{897e2dd9-2646-4d9e-a20d-f40da228e85e}', 'entregado', 1, 'https://trello.com/c/I5pTvJH2/51-comunicaci%C3%B3n-ganadores-reto-gofluent', '[AVANCE CREADOR]: Re-entrega de material sin comentarios.', '2026-07-14 23:35:27.901139+00', '2026-07-14 23:35:27.901139+00', NULL),
	('04cb96e5-5687-4561-b587-bbaca34b9e5e', '2dc92d52-5d88-4481-8b3e-b931d11fb4ee', 'RP', '{2072a09e-3804-447f-a7f5-efacc0589e83}', 'entregado', 1, 'https://trello.com/c/gcZI6T2S', '', '2026-07-16 01:23:35.666723+00', '2026-07-16 01:24:50.545+00', 'Visualización de cómo se verá la renovación del micrositio con la identidad del Informe de Sustentabilidad 2025'),
	('d4630e39-7639-4937-9cc8-642a9a4dcc86', '32b61433-ed15-47eb-bdab-b1ab77a6c432', 'Contenido', '{4b4cc46b-65be-4faa-9d06-81e4d6893343}', 'aprobado', 1, 'https://docs.google.com/document/d/18xlyipEeQQb6lHxGdnlowjhHiHjbKYmLFq-pgxbLueY/edit?tab=t.ravsgp1ao0bp#heading=h.ltgwt9gppy0f', '', '2026-07-16 19:19:58.704859+00', '2026-07-16 20:33:31.028+00', NULL),
	('18214486-f45a-4080-9fe8-08c44b78e641', '39814a11-6b11-44dc-bf31-a13902f75174', 'Programación', '{17d5d747-fdd1-4d4f-88cc-aa2909995088}', 'aprobado', 1, 'https://trello.com/c/9b09M3uq', '[ENTREGA COLABORADOR]:
Lisata actualizada ', '2026-07-16 19:01:54.131502+00', '2026-07-17 16:28:53.532+00', NULL),
	('0c041f1b-c7f9-4cbc-b892-83fbeabc9c93', '39814a11-6b11-44dc-bf31-a13902f75174', 'RP', '{79296d44-1dcc-43ae-9b98-d94378ed37c0}', 'aprobado', 1, 'https://trello.com/c/9b09M3uq', '', '2026-07-16 19:01:54.454408+00', '2026-07-17 20:08:46.573+00', 'Dar seguimiento con Programación que quede la actualización lista '),
	('6f8c3101-d259-4392-af34-7d7e5791c955', 'c09acacf-b590-406a-9c82-4d192a98baa4', 'Diseño', '{6d346f9b-3c06-47bb-9c2f-243bcc93b744}', 'entregado', 2, 'https://trello.com/c/y174BMZZ/286-narrativa-ajuste', '[AVANCE CREADOR]: se realizo el ajuste solicitado de las 2 paginas agregadas de falsificación de medicamentos, y el ajuste de ll indice y numero de hojas', '2026-07-15 18:49:15.023159+00', '2026-07-15 18:49:15.023159+00', 'Agregar texto a la Narrativa:

Falsificación de medicamentos

 

El comercio ilegal de medicamentos, incluyendo falsificación, contrabando, robo, desvío y venta en canales no autorizados, representa un reto creciente para el sistema de salud en México, ya que pone en riesgo directo la seguridad de los pacientes y la confianza en los tratamientos. De acuerdo con estimaciones del IPN/ENCB, este mercado supera los $32 mil millones de pesos anuales, con un crecimiento estimado de 78% frente a 2019; además, en canales informales, hasta 6 de cada 10 medicamentos podrían ser robados, caducos o falsificados. La evidencia de COFEPRIS también muestra la magnitud del reto: en 2025 se identificaron 58 alertas sanitarias de medicamentos, y en el caso de productos de Novo Nordisk se han emitido alertas relacionadas con Rybelsus, Ozempic, Victoza, Wegovy, Saxenda y NovoSeven RT por falsificación y/o comercialización irregular. Frente a este contexto, Novo Nordisk México ha presentado alrededor de 20 denuncias sanitarias ante COFEPRIS desde 2023, mantiene monitoreo de canales físicos y digitales de riesgo, capacita a autoridades como Aduanas y COFEPRIS, impulsa campañas educativas e informativas, cuenta con un call center 24/7 para asesorar y recibir reportes sobre posibles productos sospechosos, y colabora con plataformas digitales como Mercado Libre, mediante su programa de Brand Protection, para combatir la comercialización irregular en línea.  

 

Acciones que estamos llevando a cabo:

Capacitación y colaboración con autoridades: como parte del despliegue 2026, a la fecha hemos capacitado a 126 funcionarios de Aduanas y 189 participantes de COFEPRIS. Continuamos con el plan de entrenar a más de 500 funcionarios de Aduanas en 10 ubicaciones del país; hasta ahora se han realizado sesiones en Ciudad de México, Guadalajara, Tijuana y, más recientemente, Querétaro.
Denuncias y respuesta institucional: Novo Nordisk México ha presentado alrededor de 20 denuncias sanitarias ante COFEPRIS desde 2023, relacionadas con posibles casos de falsificación, comercialización irregular y otros riesgos asociados a productos ilegítimos; adicionalmente, se han presentado denuncias ante Ministerio Público por hurto en Aduana AIFA y robo de mercancía en tránsito.
Monitoreo de mercados y canales de riesgo: mantenemos vigilancia sobre plataformas de venta en línea, redes sociales, aplicaciones de mensajería, tianguis y mercados, domicilios particulares y farmacias en zonas turísticas y fronterizas, donde se ha identificado riesgo de oferta o distribución de medicamentos ilegítimos.
Campañas educativas e informativas: impulsamos acciones de comunicación para orientar a pacientes, profesionales de la salud y otros actores relevantes sobre los riesgos de adquirir medicamentos fuera de canales autorizados, la importancia de verificar el origen del producto y los mecanismos disponibles para reportar sospechas.
Canales de atención y reporte: contamos con un call center 24/7 para brindar asesoría, recibir reportes o denuncias sobre posibles productos sospechosos y canalizar los casos para su revisión y seguimiento correspondiente.
Colaboración con plataformas digitales: trabajamos con Mercado Libre a través de su programa de Brand Protection, con el objetivo de identificar, reportar y solicitar la baja de publicaciones que puedan estar relacionadas con la comercialización irregular o no autorizada de productos Novo Nordisk.'),
	('bf40462b-f659-4260-9f05-88010ff824ac', '155502e6-f2ad-4057-a870-430f718b9cf0', 'Diseño', '{897e2dd9-2646-4d9e-a20d-f40da228e85e}', 'entregado', 1, 'https://trello.com/c/Y2ql52D2/50-plantilla-sesiones-de-salud-y-vida', '[AVANCE CREADOR]: Re-entrega de material sin comentarios.', '2026-07-16 20:48:19.563137+00', '2026-07-16 20:48:19.563137+00', NULL),
	('59a2800a-b7ba-48fe-b95d-4439a2ee70b9', '176a391a-f55d-4976-b457-91e95299f432', 'Diseño', '{897e2dd9-2646-4d9e-a20d-f40da228e85e}', 'entregado', 1, 'https://trello.com/c/9sIu7t5T/766-chivapuertas-nike', '[AVANCE CREADOR]: Re-entrega de material sin comentarios.', '2026-07-16 20:50:50.592792+00', '2026-07-16 20:50:50.592792+00', NULL),
	('af63d58d-be30-4d0a-bb80-b4fc5c8dfa92', 'f34a94ca-1292-4099-83c1-4e5765900b97', 'Contenido', '{2ae3b814-56ed-43f9-9ccb-bbdee48022f8}', 'aprobado', 1, 'https://docs.google.com/document/d/1NwLYuvXY3ZSiImglEMwbW0hYqLYW8oe4ozzDbCCVIqI/edit?usp=sharing', '', '2026-07-15 00:24:19.827944+00', '2026-07-15 20:43:55.633+00', 'Dejo aquí el texto https://docs.google.com/document/d/1CxieWxUxe6TkercEO6k0j9kQtitFU5Zw_dCiY4x8Ek0/edit?usp=sharing 
'),
	('f625e603-2ac0-4c23-ac08-1eef3846ae8e', '02a3a945-7dee-466e-b018-78e2c3c07a74', 'Diseño', '{}', 'pendiente', 1, NULL, NULL, '2026-07-16 20:47:13.206842+00', '2026-07-16 20:47:13.206842+00', NULL),
	('a422f24d-c96d-411a-808b-3b328a555b6d', '5338889e-badf-4b6f-abaf-b0889db71658', 'Contenido', '{4b4cc46b-65be-4faa-9d06-81e4d6893343}', 'aprobado_interno', 1, 'https://docs.google.com/document/d/1UbaLBIW_z_KyPEYtw9_c8SLGOKdwxQn4SHgJlo8624E/edit?tab=t.0', '', '2026-07-16 19:39:22.45831+00', '2026-07-16 20:31:44.163+00', 'Asunto: Aviso 

Estimados colaboradores,
Les informamos que la asignación de Elizabeth Santamaría como External Support Analyst (Procurement) dentro de los servicios especializados ha concluido.
Les pedimos su apoyo para que, en este periodo de transición, cualquier tema puedan resolverlo con Mariana Bernal (NMBB).

Les agradezco mucho su apoyo y quedo pendiente de cualquier duda. '),
	('d754946a-8286-4b40-815c-3f904391dd63', 'ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', 'Diseño', '{}', 'pendiente', 1, NULL, NULL, '2026-07-16 17:35:20.296862+00', '2026-07-16 17:35:20.296862+00', NULL),
	('509237fc-97aa-41e7-a4b1-7865bda4466e', 'ed7a96bc-d09a-4e91-b6ab-0277d3e55cc1', 'RP', '{2072a09e-3804-447f-a7f5-efacc0589e83}', 'pendiente', 1, NULL, NULL, '2026-07-16 17:35:20.546874+00', '2026-07-16 17:35:20.546874+00', 'Logotipo de AMS con estas características:
Formato: PNG
Dimensiones: 160 × 100 píxeles
Color: RGB'),
	('5d45cdf7-96d9-4995-9a3c-c7156914809b', '02a3a945-7dee-466e-b018-78e2c3c07a74', 'RP', '{2072a09e-3804-447f-a7f5-efacc0589e83}', 'pendiente', 1, NULL, NULL, '2026-07-16 20:47:13.50507+00', '2026-07-16 20:47:13.50507+00', 'Diseñar en PPT la primera versión del programa. Son 2 archivos; para autoridades y para invitados'),
	('1f55cb90-7b46-4e16-8e18-29ac3799114f', '22f64b33-fbe4-4da8-ae5f-b7aac0342a12', 'Contenido', '{2ae3b814-56ed-43f9-9ccb-bbdee48022f8}', 'aprobado', 1, 'https://trello.com/c/fyLclKXl/49-invitaci%C3%B3n-examen-go-fluent', '', '2026-07-16 19:19:41.839062+00', '2026-07-17 20:24:31.912+00', NULL),
	('878c93dc-d139-4556-be9b-6a71af8b537b', 'b5c868b4-829b-4a06-833c-f86333fe605b', 'Contenido', '{}', 'pendiente', 1, NULL, NULL, '2026-07-16 20:24:22.065691+00', '2026-07-16 20:24:22.065691+00', NULL),
	('be0eb86c-c377-4c81-a0ba-b198fdff3751', 'd9afdbee-a381-49b5-8891-865e8048df42', 'RP', '{2072a09e-3804-447f-a7f5-efacc0589e83}', 'aprobado_interno', 1, 'Se envió por correo ', '[ENTREGA COLABORADOR]:
Miriam ya dio ok para enviar', '2026-07-15 19:49:32.299879+00', '2026-07-16 00:59:27.27+00', 'Dar seguimiento a los ajustes y envío del newsletter semanal'),
	('a0d9388e-4aab-40ee-a833-4fae7401d586', '155502e6-f2ad-4057-a870-430f718b9cf0', 'Contenido', '{f018a13c-779a-4435-92c2-53b133c2a72d,4b4cc46b-65be-4faa-9d06-81e4d6893343}', 'aprobado_interno', 1, 'https://docs.google.com/document/d/14xSJ1iWQniud7DjE3Nz43OeaQDip46AMYMhCecUNKwE/edit?tab=t.0', '', '2026-07-16 20:48:19.095722+00', '2026-07-16 23:16:19.114+00', 'Hola team, pueden apoyarme con el texto, gracias'),
	('b40456e1-d2cf-45f2-9b7a-e5b6146da3ba', '2dc92d52-5d88-4481-8b3e-b931d11fb4ee', 'Contenido', '{}', 'con_correcciones', 1, NULL, '🚨 NUEVAS CORRECCIONES REGISTRADAS:
• [FILTRO CLIENTE]: Se enviaron ajustes a los textos, el archivo está en Trello: https://trello.com/c/gcZI6T2S', '2026-07-16 02:17:35.346219+00', '2026-07-16 02:17:35.346219+00', NULL),
	('29cff1de-eeb2-4a6a-ad8d-4ac452b15908', '5338889e-badf-4b6f-abaf-b0889db71658', 'Diseño', '{855ecf57-5a53-4e36-91db-d4e607a8bb42}', 'pendiente', 1, NULL, NULL, '2026-07-16 19:39:22.716151+00', '2026-07-16 19:39:22.716151+00', 'Comunicado Diseño corporativo'),
	('55f168ee-3865-4ad6-922c-a56b623f4d6e', '2dc92d52-5d88-4481-8b3e-b931d11fb4ee', 'Programación', '{17d5d747-fdd1-4d4f-88cc-aa2909995088}', 'con_correcciones', 1, NULL, '🚨 NUEVAS CORRECCIONES REGISTRADAS:
• [FILTRO CLIENTE]: La foto del header no debe taparse con las plecas, tomar de referencia la portada del Informe
• [FILTRO CLIENTE]: Los cuadros de color ponerlos hasta el borde de la página
• [FILTRO CLIENTE]: Tamaño de letra de las cifras que sea más grande
• [FILTRO CLIENTE]: Tamaño de los títulos de Ambiental, Social y Económico hacerlas más grandes
• [FILTRO CLIENTE]: Corregir el mock up del Informe y la pleca que quede completa por detrás

🚨 NUEVAS CORRECCIONES REGISTRADAS:
• [FILTRO CLIENTE]: Ajustar presentación de cifras con scroll horizontal en forma de tarjetas', '2026-07-16 01:23:35.357176+00', '2026-07-16 01:23:35.357176+00', NULL),
	('e1353bac-7022-45c8-9e46-230e018085a9', 'd45c7e7c-02ec-4d6d-9053-82199ead5f88', 'Contenido', '{f018a13c-779a-4435-92c2-53b133c2a72d}', 'entregado', 1, 'https://docs.google.com/document/d/18xlyipEeQQb6lHxGdnlowjhHiHjbKYmLFq-pgxbLueY/edit?usp=sharing', '', '2026-07-16 17:21:48.368686+00', '2026-07-17 20:27:41.441+00', NULL),
	('a77e2263-6c29-42c3-8159-9d8d83bf962d', 'c56f1367-cd03-45c2-aac9-dda4966ac3b8', 'Contenido', '{e1f33a82-a3a0-4fd2-99e6-4a94723c3c53}', 'aprobado', 1, 'https://docs.google.com/document/d/1C39LGioH1qb_qZfCEQAq6fLgpvtq-VU28o9t7KGSRCQ/edit?usp=sharing', '', '2026-07-16 20:07:24.388858+00', '2026-07-16 23:58:23.547+00', NULL),
	('f1dbf3a9-aecc-4439-96e8-d9aa1b6b7152', 'c56f1367-cd03-45c2-aac9-dda4966ac3b8', 'Diseño', '{}', 'aprobado', 1, NULL, '🚨 NUEVAS CORRECCIONES REGISTRADAS:
• [FILTRO CLIENTE]: Diseñar infografía y pantallas con el texto adjunto', '2026-07-17 00:26:32.631276+00', '2026-07-17 00:26:32.631276+00', NULL);


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sectors" ("id", "name") VALUES
	('78c3f250-36cc-4107-bfb8-fb2b6b2afff8', 'Tecnología'),
	('c1244ba5-bb37-4738-a83c-5362cc12b5ed', 'Alimentos / Consumo'),
	('1e2701a4-9fad-45fd-bfe2-53e94d585d15', 'Entretenimiento'),
	('a9e74989-2b8f-4dde-9fce-1d704b783b0f', 'Finanzas'),
	('4dfbec09-12ea-4aa2-a04a-765f6af463e5', 'Industrial'),
	('327f1836-c777-40bc-8333-3b41b5785b4e', 'Salud'),
	('8ab3cf25-ff70-4807-89e2-9aa7b82401d2', 'Deportes'),
	('00ac2f24-c79b-45d6-a7cc-4b5d8adaaf71', 'Comunicación'),
	('5ea3965d-e781-450e-b423-dba76554cd95', 'Automovilístico'),
	('06f4af85-8a2a-4d02-bc03-6f26fba50342', 'Educación'),
	('fbd32a8e-c529-4211-a1a7-7865239a7427', 'Energía');


--
-- Data for Name: task_adjustments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."task_adjustments" ("id", "task_id", "description", "origin", "is_internal", "status", "created_by", "created_at", "resolved_at") VALUES
	('b2a85251-13b4-48b7-85ef-ba77fabe9284', 'b40456e1-d2cf-45f2-9b7a-e5b6146da3ba', 'Se enviaron ajustes a los textos, el archivo está en Trello: https://trello.com/c/gcZI6T2S', 'cliente', false, 'pendiente', NULL, '2026-07-16 02:17:35.494513+00', NULL),
	('19e4d015-3b6e-490a-84d0-5902473ed3b5', '18369316-e24c-4e40-8e07-a1022e41a5af', 'ok', 'agencia', true, 'resuelto', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-08 17:26:14.092728+00', '2026-07-08 17:33:06.936+00'),
	('3ce6fdc5-5bef-48ef-ad6a-c6a63e5c2323', '18369316-e24c-4e40-8e07-a1022e41a5af', 'nambre haslo bien pa', 'agencia', true, 'resuelto', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-08 17:32:57.116575+00', '2026-07-08 17:33:06.936+00'),
	('ee6ae46e-b330-4e68-a180-0e1595d423cd', 'ca64dd3c-d93a-4b27-9584-994766822333', 'echele', 'agencia', true, 'resuelto', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-08 18:38:30.225966+00', '2026-07-08 18:40:08.04+00'),
	('cdd3d4a3-1c05-44ac-8e10-2f3ba4dc1275', 'ca64dd3c-d93a-4b27-9584-994766822333', 'ola', 'agencia', true, 'resuelto', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-08 18:39:47.307734+00', '2026-07-08 18:40:08.04+00'),
	('16684701-4c92-4c46-8a06-53543d3892b9', '55f168ee-3865-4ad6-922c-a56b623f4d6e', 'La foto del header no debe taparse con las plecas, tomar de referencia la portada del Informe', 'cliente', false, 'pendiente', NULL, '2026-07-16 17:40:52.851441+00', NULL),
	('f1b168c5-e9d4-41bd-a524-ece8e06b0dde', '55f168ee-3865-4ad6-922c-a56b623f4d6e', 'Los cuadros de color ponerlos hasta el borde de la página', 'cliente', false, 'pendiente', NULL, '2026-07-16 17:40:52.851441+00', NULL),
	('2de43bb5-f8ed-43a1-842e-21fa1e061333', '55f168ee-3865-4ad6-922c-a56b623f4d6e', 'Tamaño de letra de las cifras que sea más grande', 'cliente', false, 'pendiente', NULL, '2026-07-16 17:40:52.851441+00', NULL),
	('8799d669-fbaf-4c42-9811-b4aac1a5ded8', '2a280313-a43a-4964-9898-2e6875da20a6', 'Se cambió la redacción del newsletter porque eran dos notas diferentes', 'agencia', true, 'pendiente', NULL, '2026-07-15 19:45:26.273847+00', NULL),
	('7e9317e9-e9cf-491e-9d1b-3471600b8c99', '1eb45f14-0307-4737-860e-c0fcf97f88a9', 'Se gregaron mas competidoras', 'cliente', false, 'pendiente', NULL, '2026-07-15 21:18:44.487123+00', NULL),
	('27b2f5d8-18a0-44b9-ab4e-d71703369176', '55f168ee-3865-4ad6-922c-a56b623f4d6e', 'Tamaño de los títulos de Ambiental, Social y Económico hacerlas más grandes', 'cliente', false, 'pendiente', NULL, '2026-07-16 17:40:52.851441+00', NULL),
	('e2d67797-94d1-4477-bf18-2b2f1d79e034', '55f168ee-3865-4ad6-922c-a56b623f4d6e', 'Corregir el mock up del Informe y la pleca que quede completa por detrás', 'cliente', false, 'pendiente', NULL, '2026-07-16 17:40:52.851441+00', NULL),
	('1c6aabd4-35f7-4049-9979-963e1dd72d5b', '55f168ee-3865-4ad6-922c-a56b623f4d6e', 'Ajustar presentación de cifras con scroll horizontal en forma de tarjetas', 'cliente', false, 'pendiente', NULL, '2026-07-16 18:23:33.335345+00', NULL),
	('5ef36897-11c4-42a1-8671-2f227c851c2b', 'f1dbf3a9-aecc-4439-96e8-d9aa1b6b7152', 'Diseñar infografía y pantallas con el texto adjunto', 'cliente', false, 'pendiente', NULL, '2026-07-17 00:26:32.798022+00', NULL);


--
-- Data for Name: task_assignees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."task_assignees" ("id", "task_id", "profile_id", "created_at") VALUES
	('90fffb2e-8422-4e08-bf94-931c9b879be7', '18369316-e24c-4e40-8e07-a1022e41a5af', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 17:21:51.680599+00'),
	('94ae2ea3-eaa4-4dea-ada7-ad13782dabc9', 'ca64dd3c-d93a-4b27-9584-994766822333', '0cf675b5-4eaf-4b2c-9bf1-989b23e1ebbb', '2026-07-08 18:27:49.172563+00'),
	('d1cd8a5f-b0f7-4234-9e21-7df77b766a24', 'ca64dd3c-d93a-4b27-9584-994766822333', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-08 18:27:49.172563+00'),
	('920fed99-9fc7-4b72-aed6-33bbbbc05655', '55f168ee-3865-4ad6-922c-a56b623f4d6e', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-17 00:34:12.083034+00'),
	('f5afeb98-30be-4666-b6ca-7ccbc64c897c', 'a85a7556-7d6c-4527-8e25-814985aec313', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-10 23:08:25.271069+00'),
	('7f008c33-2dff-42a2-854f-446ae535f7d0', '04cb96e5-5687-4561-b587-bbaca34b9e5e', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-17 00:34:12.590786+00'),
	('3805abbc-caac-47d4-beba-6de323d7f01f', 'a77e2263-6c29-42c3-8159-9d8d83bf962d', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-17 16:07:41.006543+00'),
	('26d0851e-8525-48e0-a3e0-d2b70903092f', '18214486-f45a-4080-9fe8-08c44b78e641', '17d5d747-fdd1-4d4f-88cc-aa2909995088', '2026-07-17 16:25:14.698096+00'),
	('a24a2491-383b-429b-b793-9093cdbbdca8', '0c041f1b-c7f9-4cbc-b892-83fbeabc9c93', '79296d44-1dcc-43ae-9b98-d94378ed37c0', '2026-07-17 16:25:15.470879+00'),
	('bdf1220d-2665-41f0-abd5-1557b9a5fe0d', '9af1d207-c1cd-4db0-a5ec-f389df440af2', 'f018a13c-779a-4435-92c2-53b133c2a72d', '2026-07-17 20:25:20.535874+00'),
	('e38056e8-093b-4210-9b43-8d15e8e6d0c9', 'a3868554-3f75-4462-b52a-dc27c2710c24', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-17 20:25:21.027922+00'),
	('1d290c45-3a7d-4d07-a659-c489b2658ca1', '6f8c3101-d259-4392-af34-7d7e5791c955', '6d346f9b-3c06-47bb-9c2f-243bcc93b744', '2026-07-15 18:49:15.305985+00'),
	('e81e0d7e-a17d-4cb9-bb09-fd11d217f0ae', '9598623e-a48e-4f7e-b716-cd17f2010d82', '000ed70a-a668-4379-82c6-a82e7d523543', '2026-07-15 19:12:45.83439+00'),
	('95597fc5-4700-43c2-8a44-f98091d3e821', 'a090f56c-dd81-4531-988e-a3c049d8b460', '9664bab8-28d5-4d9c-9dfc-f4cf1a9bd91a', '2026-07-15 19:16:42.992671+00'),
	('6236b22e-091a-46d7-a30b-5b47f11d000a', '1eb45f14-0307-4737-860e-c0fcf97f88a9', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-15 19:53:54.088715+00'),
	('0963658e-b91e-4d8c-8798-9b160f6f9c68', 'af63d58d-be30-4d0a-bb80-b4fc5c8dfa92', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-16 01:01:53.477082+00'),
	('3bfdb72d-69e1-41f3-a452-266111c26167', 'ebfebb2e-4f34-464a-8c80-b229a65a2223', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-16 01:01:53.795874+00'),
	('e3c4f3ab-684c-4377-b97f-208f71326bb3', 'be0eb86c-c377-4c81-a0ba-b198fdff3751', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 01:12:22.144689+00'),
	('f61c208f-67ad-4901-9f09-21abfd14ba87', 'e1353bac-7022-45c8-9e46-230e018085a9', 'f018a13c-779a-4435-92c2-53b133c2a72d', '2026-07-16 17:23:23.590101+00'),
	('80687ddf-1a7d-4159-b35d-4416ea3efb80', '509237fc-97aa-41e7-a4b1-7865bda4466e', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 17:35:20.786046+00'),
	('3bd10af0-c011-4f65-bc1d-069e8a40632c', '1f55cb90-7b46-4e16-8e18-29ac3799114f', '2ae3b814-56ed-43f9-9ccb-bbdee48022f8', '2026-07-16 19:19:42.309846+00'),
	('a7a362dc-025e-44d8-97e5-790935eb4e9c', 'd4630e39-7639-4937-9cc8-642a9a4dcc86', '4b4cc46b-65be-4faa-9d06-81e4d6893343', '2026-07-16 19:19:59.147284+00'),
	('697d3e0f-e24b-4de1-9b60-7c09e6cadeb0', 'a94fe95e-6447-49e4-94c2-1f02f441e21c', '83c72fb1-c24b-47b9-9cc2-1692f3ca0b6a', '2026-07-16 20:22:39.807806+00'),
	('852fe997-6419-4c7a-a251-f7c7461e2f48', 'dc83681e-4ea8-4012-a463-3e86795e907c', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 20:22:40.198707+00'),
	('bcd8e4cd-e5ff-4970-945a-621dc4b2d91c', '5d45cdf7-96d9-4995-9a3c-c7156914809b', '2072a09e-3804-447f-a7f5-efacc0589e83', '2026-07-16 20:47:13.784509+00'),
	('5cf0bf1e-66d2-4d15-a576-fdfa3fbe0ac2', '59a2800a-b7ba-48fe-b95d-4439a2ee70b9', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-16 20:50:50.914819+00'),
	('721f3ed6-6473-459a-8451-8adfceb73528', 'a422f24d-c96d-411a-808b-3b328a555b6d', '4b4cc46b-65be-4faa-9d06-81e4d6893343', '2026-07-16 21:00:00.565668+00'),
	('b0353521-862f-4f50-8945-292308c37e3a', '29cff1de-eeb2-4a6a-ad8d-4ac452b15908', '855ecf57-5a53-4e36-91db-d4e607a8bb42', '2026-07-16 21:00:00.914062+00'),
	('e6a227a2-56a8-4302-83cc-4acadb4d7125', 'a0d9388e-4aab-40ee-a833-4fae7401d586', 'f018a13c-779a-4435-92c2-53b133c2a72d', '2026-07-16 23:18:16.321371+00'),
	('a823ba59-54c3-44a3-b46d-140fac9268cd', 'a0d9388e-4aab-40ee-a833-4fae7401d586', '4b4cc46b-65be-4faa-9d06-81e4d6893343', '2026-07-16 23:18:16.321371+00'),
	('5f8d0170-84af-490b-9f47-a521384f3147', 'bf40462b-f659-4260-9f05-88010ff824ac', '897e2dd9-2646-4d9e-a20d-f40da228e85e', '2026-07-16 23:18:16.679107+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('deliverables', 'deliverables', NULL, '2026-05-12 17:03:43.43204+00', '2026-05-12 17:03:43.43204+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('avatars', 'avatars', NULL, '2026-05-13 00:19:46.170995+00', '2026-05-13 00:19:46.170995+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('client-logos', 'client-logos', NULL, '2026-05-18 21:00:09.256609+00', '2026-05-18 21:00:09.256609+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('request-attachments', 'request-attachments', NULL, '2026-05-21 00:08:29.490972+00', '2026-05-21 00:08:29.490972+00', true, false, 10485760, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('7cd8bdfc-8607-447b-b147-f4bb1ba42b90', 'client-logos', 'logos/1779146004770.png', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-18 23:13:26.744659+00', '2026-05-18 23:13:26.744659+00', '2026-05-18 23:13:26.744659+00', '{"eTag": "\"d444637a55d13fcce47f6dbf935985eb\"", "size": 57626, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-18T23:13:27.000Z", "contentLength": 57626, "httpStatusCode": 200}', '7ce1e7f7-b243-4a10-adc7-06c5a8ca6223', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('a734f2a4-4fec-4d61-a558-31ee5b72482a', 'client-logos', 'projects/project_1782414656521.webp', '38fc9683-4851-42fd-9d97-a73e1fecfde9', '2026-06-25 19:11:01.088426+00', '2026-06-25 19:11:01.088426+00', '2026-06-25 19:11:01.088426+00', '{"eTag": "\"231a498c06cadfbc2c5c45fa9d91e08f\"", "size": 134624, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T19:11:02.000Z", "contentLength": 134624, "httpStatusCode": 200}', '00ba7701-3287-4c03-a480-c79620021004', '38fc9683-4851-42fd-9d97-a73e1fecfde9', '{}'),
	('aab8006b-5b81-40a5-add4-61cc6e608b17', 'client-logos', 'logos/1779213215450.png', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-19 17:53:36.596758+00', '2026-05-19 17:53:36.596758+00', '2026-05-19 17:53:36.596758+00', '{"eTag": "\"0fb636512507656c59455d38eaecbd62\"", "size": 48429, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-19T17:53:37.000Z", "contentLength": 48429, "httpStatusCode": 200}', '661de3eb-8ed1-48d0-bb65-bbfed9678a88', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('ce8b7be0-efff-4c26-9ea3-7e5ca55a634e', 'avatars', 'avatars/1779239607270.png', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-20 01:13:29.521669+00', '2026-05-20 01:13:29.521669+00', '2026-05-20 01:13:29.521669+00', '{"eTag": "\"6c5de8423081c248fcd4563cda7820cd\"", "size": 153479, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-20T01:13:30.000Z", "contentLength": 153479, "httpStatusCode": 200}', '6ff9f030-6d0b-4934-9ef4-5d3c28541116', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('c3130e25-6ea5-474e-a842-ab2e8391c8a1', 'client-logos', 'logos/logo_1783702506958.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 16:55:07.719271+00', '2026-07-10 16:55:07.719271+00', '2026-07-10 16:55:07.719271+00', '{"eTag": "\"d56312d8e024bb8fa5b8c5c075207f8d\"", "size": 6996, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:55:08.000Z", "contentLength": 6996, "httpStatusCode": 200}', '70e46a64-a6ec-4fb3-af08-3f12bd51e293', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('af63c3ce-10b1-4953-a33e-f4b55625aa61', 'avatars', 'staff/1779297309839-Roland Garros.png', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-20 17:15:11.443107+00', '2026-05-20 17:15:11.443107+00', '2026-05-20 17:15:11.443107+00', '{"eTag": "\"e838ccb20a6d10e211f117e5ffc4324f\"", "size": 42000, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-20T17:15:12.000Z", "contentLength": 42000, "httpStatusCode": 200}', '1492cd8a-8ae5-4407-8858-cbf62ff7810c', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('7327b806-cdc8-42d6-87e7-a60729aeef13', 'avatars', 'avatars/1779311214744.jpg', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-20 21:06:56.903092+00', '2026-05-20 21:06:56.903092+00', '2026-05-20 21:06:56.903092+00', '{"eTag": "\"1842fefe1f514af81a3dd19b83f96fc7\"", "size": 402748, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-20T21:06:57.000Z", "contentLength": 402748, "httpStatusCode": 200}', 'fa77ae69-0398-4d9f-9563-ce8574df3ad8', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('ce8afdff-f1f0-46ed-94d8-22fefba7f7a9', 'client-logos', 'logos/banner_1783702508125.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 16:55:15.082076+00', '2026-07-10 16:55:15.082076+00', '2026-07-10 16:55:15.082076+00', '{"eTag": "\"f67d722cc662d1f61e8913efd4caf316\"", "size": 420926, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:55:16.000Z", "contentLength": 420926, "httpStatusCode": 200}', 'dfdb0de3-6c87-4c10-a52b-4c95b119bde5', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('24909318-a361-4745-870c-88fee9777365', 'avatars', 'avatars/1779317092150.jpg', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-20 22:45:00.877945+00', '2026-05-20 22:45:00.877945+00', '2026-05-20 22:45:00.877945+00', '{"eTag": "\"1842fefe1f514af81a3dd19b83f96fc7\"", "size": 402748, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-20T22:45:01.000Z", "contentLength": 402748, "httpStatusCode": 200}', 'c84395fb-a126-4555-a39e-5e1b9c3516f7', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('a32cb5b9-0e19-4807-9014-e392ea721f4a', 'avatars', 'staff/1b1d4808-6e01-433b-a7fe-508c1c70173a-1779317146133', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-20 22:45:48.103045+00', '2026-05-20 22:45:48.103045+00', '2026-05-20 22:45:48.103045+00', '{"eTag": "\"79ac87a0f6061c2e57e9e327b4690d97\"", "size": 50220, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-20T22:45:49.000Z", "contentLength": 50220, "httpStatusCode": 200}', '4f92d0b5-d49b-4b02-b339-c37f84ec6862', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('b1c713b5-b2d1-4354-a9e2-b6b83332f354', 'avatars', 'avatars/1779379338458.jpg', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-21 16:02:25.834552+00', '2026-05-21 16:02:25.834552+00', '2026-05-21 16:02:25.834552+00', '{"eTag": "\"1842fefe1f514af81a3dd19b83f96fc7\"", "size": 402748, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-21T16:02:26.000Z", "contentLength": 402748, "httpStatusCode": 200}', '42be22dd-cc75-4911-99d3-da8bef3d4127', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('69a016e3-c3f0-46f2-a81e-1b6674da5b31', 'avatars', 'avatars/1779386339972.png', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-21 17:59:00.836472+00', '2026-05-21 17:59:00.836472+00', '2026-05-21 17:59:00.836472+00', '{"eTag": "\"72e8322e805efab0e86c705ae17b3c27\"", "size": 54046, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-21T17:59:01.000Z", "contentLength": 54046, "httpStatusCode": 200}', 'e816603a-9899-42f8-a04e-0872a19a663e', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('01e6e123-815d-4ab2-b7cd-7d7ca0296ec2', 'avatars', 'avatars/1779388425427.jpg', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-21 18:33:46.445743+00', '2026-05-21 18:33:46.445743+00', '2026-05-21 18:33:46.445743+00', '{"eTag": "\"460c6b04ee47cba5eb15baaaab9ef2ac\"", "size": 741820, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-21T18:33:47.000Z", "contentLength": 741820, "httpStatusCode": 200}', '5296ef8f-3ef9-4850-8192-3107a1e422d3', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('7df9079e-16d4-460a-b9d9-21e5d94d3e12', 'client-logos', 'logos/1779404611901.webp', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-21 23:03:33.734754+00', '2026-05-21 23:03:33.734754+00', '2026-05-21 23:03:33.734754+00', '{"eTag": "\"2dec45215e4b6a4c11e325837f79b6b1\"", "size": 15678, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-05-21T23:03:34.000Z", "contentLength": 15678, "httpStatusCode": 200}', '81f2f1f2-c69f-49b9-8b11-f03d8662626e', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('6d8acdf7-2279-4304-b01b-4414c301883c', 'client-logos', 'logos/banner_1782415889776.jpg', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 19:31:32.578562+00', '2026-06-25 19:31:32.578562+00', '2026-06-25 19:31:32.578562+00', '{"eTag": "\"bebc8aa32840e6ce48bfbca6478c038d\"", "size": 10693, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T19:31:33.000Z", "contentLength": 10693, "httpStatusCode": 200}', 'f90b07db-c9b1-4440-9780-8ef800c06005', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('d1c07fbd-77e9-46cc-912f-7c8dbd51b915', 'client-logos', 'logos/banner_1779406810759.jpg', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-21 23:40:19.050815+00', '2026-05-21 23:40:19.050815+00', '2026-05-21 23:40:19.050815+00', '{"eTag": "\"be7766f3eaef3c0f8566aa5adc7a2e44\"", "size": 309533, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-21T23:40:20.000Z", "contentLength": 309533, "httpStatusCode": 200}', 'e79c0271-5439-43b4-87ed-5b6aa09efa04', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('5750b658-d7b0-4a21-a0d4-300514aedfa4', 'client-logos', 'logos/banner_1779467897122.png', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-22 16:38:19.975159+00', '2026-05-22 16:38:19.975159+00', '2026-05-22 16:38:19.975159+00', '{"eTag": "\"a2f4aa9c46d1e6421df58f1e9c24ef24\"", "size": 598598, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-22T16:38:20.000Z", "contentLength": 598598, "httpStatusCode": 200}', 'c6602495-38bd-47bd-be5b-255de0d80da6', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('34fd009f-3c6c-4972-8b50-c2ddd0340918', 'client-logos', 'logos/banner_1782416024320.jpg', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 19:33:47.494531+00', '2026-06-25 19:33:47.494531+00', '2026-06-25 19:33:47.494531+00', '{"eTag": "\"82a79dd8bbcdf5d8f1656352b1a57b85\"", "size": 533130, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T19:33:48.000Z", "contentLength": 533130, "httpStatusCode": 200}', '8365735f-ad7b-44d6-a4b5-fb9c609bf71d', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('73e3aac2-f64b-4d69-9f04-a68240237c90', 'client-logos', 'projects/project_1779470756072.jpg', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-22 17:26:04.314147+00', '2026-05-22 17:26:04.314147+00', '2026-05-22 17:26:04.314147+00', '{"eTag": "\"2dffbdf853c15edaa2d459c5134fdac6\"", "size": 821721, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-22T17:26:05.000Z", "contentLength": 821721, "httpStatusCode": 200}', '1571146a-f12b-4925-985e-e27933f5d299', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('9a69a613-9f36-4167-8275-79233ba01c92', 'client-logos', 'logos/logo_1783703513043.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:11:54.099442+00', '2026-07-10 17:11:54.099442+00', '2026-07-10 17:11:54.099442+00', '{"eTag": "\"00504f3b6b2d008d55fefd09700498c1\"", "size": 5206, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:11:55.000Z", "contentLength": 5206, "httpStatusCode": 200}', '65c20877-bc4f-49b3-bce8-96d08ea68b21', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('6584baf5-e23f-4a94-a784-4d6d14253d3a', 'client-logos', 'projects/project_1779470828408.jpg', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-22 17:27:10.346446+00', '2026-05-22 17:27:10.346446+00', '2026-05-22 17:27:10.346446+00', '{"eTag": "\"2dffbdf853c15edaa2d459c5134fdac6\"", "size": 821721, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-22T17:27:11.000Z", "contentLength": 821721, "httpStatusCode": 200}', '86599d2d-d24a-4208-8ab2-800bad160f71', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('e3c124ee-7059-41a8-bf7c-49b727d9570c', 'client-logos', 'logos/banner_1779472200063.jpg', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-22 17:50:08.266215+00', '2026-05-22 17:50:08.266215+00', '2026-05-22 17:50:08.266215+00', '{"eTag": "\"8ca80af7efd36df7c74cc32eb29b7d6e\"", "size": 316919, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-22T17:50:09.000Z", "contentLength": 316919, "httpStatusCode": 200}', 'bd9ee2ec-d2a7-42cb-bf3d-d0f0a16845dd', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('b0d577c0-9d4f-4918-8a30-d9b66bf8a417', 'client-logos', 'logos/banner_1783703514518.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:11:59.360758+00', '2026-07-10 17:11:59.360758+00', '2026-07-10 17:11:59.360758+00', '{"eTag": "\"11b469a8600246dbbe2b315d29a0823f\"", "size": 707180, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:12:00.000Z", "contentLength": 707180, "httpStatusCode": 200}', '86acf935-2f30-4cc0-b24a-815a43102e9a', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('758f74af-ad6a-48a9-a27e-dd73be64f9f8', 'avatars', 'avatars/1779727548793_iv9w4d.png', '18916874-e33a-4cd1-8f05-c6b16f5e4633', '2026-05-25 16:45:49.787155+00', '2026-05-25 16:45:49.787155+00', '2026-05-25 16:45:49.787155+00', '{"eTag": "\"430a002ca48df0a9bf4edd77efbab39b\"", "size": 541814, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-25T16:45:50.000Z", "contentLength": 541814, "httpStatusCode": 200}', 'cc4892c3-ec5f-469f-aa66-1e30a7024463', '18916874-e33a-4cd1-8f05-c6b16f5e4633', '{}'),
	('b6e00aa6-de96-4ff2-ad58-97e9d0e46ea9', 'avatars', 'avatars/1779727636520_zkagwa.webp', '18916874-e33a-4cd1-8f05-c6b16f5e4633', '2026-05-25 16:47:18.004585+00', '2026-05-25 16:47:18.004585+00', '2026-05-25 16:47:18.004585+00', '{"eTag": "\"5e00be6d8212cc334f09cede27a988bc\"", "size": 14614, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-05-25T16:47:18.000Z", "contentLength": 14614, "httpStatusCode": 200}', '26213fc2-c583-4545-905d-b156d35d856f', '18916874-e33a-4cd1-8f05-c6b16f5e4633', '{}'),
	('92b06c89-7f51-4450-b224-c1ef816908b8', 'avatars', 'staff/75717e31-f060-450d-8163-d21f1b8519e4-1779730490445.png', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-25 17:34:50.967863+00', '2026-05-25 17:34:50.967863+00', '2026-05-25 17:34:50.967863+00', '{"eTag": "\"9210f4ebb58d8613839a9ee7299d9b07\"", "size": 39060, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-25T17:34:51.000Z", "contentLength": 39060, "httpStatusCode": 200}', '54cb8169-42ef-48c5-9c6e-22a74a6f67ee', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('74087004-3d3e-4db8-88d8-00cc1e3512ed', 'client-logos', 'projects/project_1779732646106.webp', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-25 18:10:46.863585+00', '2026-05-25 18:10:46.863585+00', '2026-05-25 18:10:46.863585+00', '{"eTag": "\"5e00be6d8212cc334f09cede27a988bc\"", "size": 14614, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-05-25T18:10:47.000Z", "contentLength": 14614, "httpStatusCode": 200}', '35615b69-d516-44ff-b4d8-daa0ecb7b2b5', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('9a8c2519-1f65-41dc-ae83-84520ac7506b', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779732837401-9az42.png', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-25 18:14:04.39501+00', '2026-05-25 18:14:04.39501+00', '2026-05-25 18:14:04.39501+00', '{"eTag": "\"fc8ee33cfc80a81b2598365de37b3fb9\"", "size": 778059, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-25T18:14:05.000Z", "contentLength": 778059, "httpStatusCode": 200}', 'd9142f31-3479-4f34-b5a1-f82e6a93fc6f', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('095be8b4-0f26-42b6-8668-4f7f9b12de33', 'client-logos', 'projects/project_1782507906830.jpg', 'b19cca69-3f8c-4e00-929a-58df124275bc', '2026-06-26 21:05:07.549084+00', '2026-06-26 21:05:07.549084+00', '2026-06-26 21:05:07.549084+00', '{"eTag": "\"1aba52da506a366ffe09eb8165ce9464\"", "size": 48381, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-26T21:05:08.000Z", "contentLength": 48381, "httpStatusCode": 200}', '507c6d83-d2c4-4c19-91c0-f1ea3495cec5', 'b19cca69-3f8c-4e00-929a-58df124275bc', '{}'),
	('9b8d16ad-cd74-4d32-a0b6-67a0b023ba80', 'client-logos', 'projects/project_1779753095671.webp', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-25 23:51:37.128403+00', '2026-05-25 23:51:37.128403+00', '2026-05-25 23:51:37.128403+00', '{"eTag": "\"5e00be6d8212cc334f09cede27a988bc\"", "size": 14614, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-05-25T23:51:38.000Z", "contentLength": 14614, "httpStatusCode": 200}', 'd3b1a354-c48f-4759-8824-7b335d15f6ed', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('f700e103-4921-4bb1-8d19-5470881dca24', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779753171461-zjiaa.png', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-25 23:52:59.784211+00', '2026-05-25 23:52:59.784211+00', '2026-05-25 23:52:59.784211+00', '{"eTag": "\"fc8ee33cfc80a81b2598365de37b3fb9\"", "size": 778059, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-25T23:53:00.000Z", "contentLength": 778059, "httpStatusCode": 200}', 'bfe0f364-840e-4495-b2a3-5f8069c5541c', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('a8737092-d33d-44db-bf75-22c68b4a5f13', 'client-logos', 'projects/project_1782508015093.png', 'b19cca69-3f8c-4e00-929a-58df124275bc', '2026-06-26 21:06:55.856584+00', '2026-06-26 21:06:55.856584+00', '2026-06-26 21:06:55.856584+00', '{"eTag": "\"f8cbe6f48a1a6763302aabdcd3802c32\"", "size": 4330, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-26T21:06:56.000Z", "contentLength": 4330, "httpStatusCode": 200}', '0d6fff48-d53a-458d-8e85-4e2d6f5af92d', 'b19cca69-3f8c-4e00-929a-58df124275bc', '{}'),
	('900c4b38-a0e2-4c93-a4dd-b36406febf5a', 'client-logos', 'logos/banner_1779755864853.png', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-26 00:37:47.563845+00', '2026-05-26 00:37:47.563845+00', '2026-05-26 00:37:47.563845+00', '{"eTag": "\"f76f45c043a75d5704e01d6e9ff6c221\"", "size": 939987, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T00:37:48.000Z", "contentLength": 939987, "httpStatusCode": 200}', '12115ef4-00a2-4a95-9fd5-4540d1d4bd47', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('d19b0a47-cb62-41f1-9be2-3ababaa32d03', 'client-logos', 'logos/logo_1783703835116.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:17:17.215152+00', '2026-07-10 17:17:17.215152+00', '2026-07-10 17:17:17.215152+00', '{"eTag": "\"b470a4ce5541ce2a9cdae4c5a809d844\"", "size": 2796, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:17:18.000Z", "contentLength": 2796, "httpStatusCode": 200}', 'ca6064fb-0a56-4463-9620-e170f4973f12', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('6f304f2f-0da0-43d1-a361-05cd84ac2635', 'avatars', 'staff/25f5759f-a7af-433d-b62c-7d0bf7703463-1779755990090', '963d77bf-25c6-4e18-851a-c4de42292ea8', '2026-05-26 00:39:51.816113+00', '2026-05-26 00:39:51.816113+00', '2026-05-26 00:39:51.816113+00', '{"eTag": "\"5e00be6d8212cc334f09cede27a988bc\"", "size": 14614, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T00:39:52.000Z", "contentLength": 14614, "httpStatusCode": 200}', '793a90af-cd34-41a6-923a-1b598c965b26', '963d77bf-25c6-4e18-851a-c4de42292ea8', '{}'),
	('2f490ed8-7305-4c8e-b61e-e91c10512c8a', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779814803229-l1uu5.docx', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-26 17:00:05.581389+00', '2026-05-26 17:00:05.581389+00', '2026-05-26 17:00:05.581389+00', '{"eTag": "\"f67962c905ab78b18c912b37aee6f9fd\"", "size": 13427, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T17:00:06.000Z", "contentLength": 13427, "httpStatusCode": 200}', '894bf12f-42ee-47e5-8057-d6089eb42f29', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('6b5e77f0-04f3-40d9-9848-cd5dcff1a27d', 'avatars', 'staff/7741139f-0e36-4568-aed9-b339750d0e03-1779824421281', '18916874-e33a-4cd1-8f05-c6b16f5e4633', '2026-05-26 19:40:22.7962+00', '2026-05-26 19:40:22.7962+00', '2026-05-26 19:40:22.7962+00', '{"eTag": "\"5f8b9f40cde90ff4f5b073b48b6c6c97\"", "size": 57832, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T19:40:23.000Z", "contentLength": 57832, "httpStatusCode": 200}', '62f26314-fd55-408e-ab8c-74cae3a39d40', '18916874-e33a-4cd1-8f05-c6b16f5e4633', '{}'),
	('f7284370-96b9-4679-a579-6142ed7dc6b0', 'avatars', 'staff/fb516cca-bae5-4460-b02e-d6742dd163a1-1779824640901', 'e424f463-cd08-4e97-865a-5ffd4eec5d88', '2026-05-26 19:44:02.73261+00', '2026-05-26 19:44:02.73261+00', '2026-05-26 19:44:02.73261+00', '{"eTag": "\"5f8b9f40cde90ff4f5b073b48b6c6c97\"", "size": 57832, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T19:44:03.000Z", "contentLength": 57832, "httpStatusCode": 200}', '1b53e180-5214-4d36-8f3c-8543bbdfe952', 'e424f463-cd08-4e97-865a-5ffd4eec5d88', '{}'),
	('d357b29b-abc8-481c-b018-3f74fc91d3a5', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779825730737-606g09.csv', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-26 20:02:12.165586+00', '2026-05-26 20:02:12.165586+00', '2026-05-26 20:02:12.165586+00', '{"eTag": "\"13f53927c9838e8aee9ac87c2de4a2d4\"", "size": 1553, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T20:02:13.000Z", "contentLength": 1553, "httpStatusCode": 200}', 'e392f9b3-80a4-45f3-9969-af8e64b2cde5', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('a20f0c0c-22cf-4d4d-b5fa-8790bccdaaba', 'client-logos', 'projects/project_1783369179338.jpg', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', '2026-07-06 20:19:42.552491+00', '2026-07-06 20:19:42.552491+00', '2026-07-06 20:19:42.552491+00', '{"eTag": "\"02115db81632562e628bd35da16ccc25\"", "size": 59915, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-06T20:19:43.000Z", "contentLength": 59915, "httpStatusCode": 200}', '23f266e2-7914-4d3c-9ff7-26808b868501', '0266ac4d-b3e8-45fa-b994-aab1020f13f6', '{}'),
	('70515341-0936-437f-ad7e-2dadcd9963b2', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779826933160-2sj7ew.pdf', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-26 20:22:15.050164+00', '2026-05-26 20:22:15.050164+00', '2026-05-26 20:22:15.050164+00', '{"eTag": "\"54152e88d285c07f254a65808b19087a\"", "size": 66520, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T20:22:16.000Z", "contentLength": 66520, "httpStatusCode": 200}', 'd3d205e3-e200-462d-baaa-4a9d8f3fe183', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('73496a8a-c683-40dd-9bb9-623d53c4ef92', 'client-logos', 'logos/banner_1783703837471.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:17:17.827837+00', '2026-07-10 17:17:17.827837+00', '2026-07-10 17:17:17.827837+00', '{"eTag": "\"896535ac6e6c6868027d8e66cf1eceb1\"", "size": 14962, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:17:18.000Z", "contentLength": 14962, "httpStatusCode": 200}', '8838e128-06c6-42be-87c3-ef8d7cea2b41', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('c181e534-b805-462a-a6db-0cca6a40579e', 'client-logos', 'projects/project_1779828979761.png', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-26 20:56:21.570305+00', '2026-05-26 20:56:21.570305+00', '2026-05-26 20:56:21.570305+00', '{"eTag": "\"5f8b9f40cde90ff4f5b073b48b6c6c97\"", "size": 57832, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T20:56:22.000Z", "contentLength": 57832, "httpStatusCode": 200}', 'fd5db3d9-ac64-4a23-8eeb-b40714e80d9b', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('28078472-69c4-4734-8464-9ff18860da29', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779829290854-p5vtny.pdf', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-26 21:01:32.64817+00', '2026-05-26 21:01:32.64817+00', '2026-05-26 21:01:32.64817+00', '{"eTag": "\"54152e88d285c07f254a65808b19087a\"", "size": 66520, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T21:01:33.000Z", "contentLength": 66520, "httpStatusCode": 200}', '195c7d88-b0d4-4849-b3ca-162595cda9c3', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('f408aa20-c12d-4170-9b23-dc6e0157ba45', 'client-logos', 'logos/logo_1783703938644.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:18:59.441399+00', '2026-07-10 17:18:59.441399+00', '2026-07-10 17:18:59.441399+00', '{"eTag": "\"6a200bdb515e060b12129eb1304e9aea\"", "size": 2170, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:19:00.000Z", "contentLength": 2170, "httpStatusCode": 200}', '3fddfda9-f5aa-4d6a-8c06-f5c70f548d28', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('9b7e9788-18ad-4c32-9578-9381a32b54cd', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779840638687-osikch.pdf', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-27 00:10:46.400769+00', '2026-05-27 00:10:46.400769+00', '2026-05-27 00:10:46.400769+00', '{"eTag": "\"54152e88d285c07f254a65808b19087a\"", "size": 66520, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T00:10:47.000Z", "contentLength": 66520, "httpStatusCode": 200}', '9d9c060c-c4da-4acb-a1a3-cc4f96c07aad', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('6dcf2c72-679f-40ae-89fc-b40e6f6bf3f3', 'request-attachments', 'references/64ee608f-721a-43c1-997e-97936f75ff87-1779843284039-3ljtat.csv', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-27 00:54:45.445714+00', '2026-05-27 00:54:45.445714+00', '2026-05-27 00:54:45.445714+00', '{"eTag": "\"69e8a8c9c7e28e2c2c499809df7e659f\"", "size": 1596, "mimetype": "text/csv", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T00:54:46.000Z", "contentLength": 1596, "httpStatusCode": 200}', 'a0d17d3b-9306-447e-9944-f1333bfeb843', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('c11ad1db-ad52-4a6f-909e-7370525b1840', 'client-logos', 'logos/banner_1783703939550.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:19:06.508729+00', '2026-07-10 17:19:06.508729+00', '2026-07-10 17:19:06.508729+00', '{"eTag": "\"789ec3d8088eb59410e544873caefb3e\"", "size": 1393408, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:19:07.000Z", "contentLength": 1393408, "httpStatusCode": 200}', '351ef302-16a4-434b-925e-5e93a03eed2c', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('4b27d5fa-f91e-4c41-a45c-d6d656f3cc7d', 'client-logos', 'projects/project_1779901741709.png', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-27 17:09:02.722619+00', '2026-05-27 17:09:02.722619+00', '2026-05-27 17:09:02.722619+00', '{"eTag": "\"5f8b9f40cde90ff4f5b073b48b6c6c97\"", "size": 57832, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T17:09:03.000Z", "contentLength": 57832, "httpStatusCode": 200}', '1c79c98b-ad53-4100-9e6d-3667583f61d6', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('2188aaa3-d3a2-4067-8b51-ed3ef2cb5cd7', 'avatars', 'staff/6099a276-2bfc-47f4-8b73-ee7ea14382b3-1779909561340', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-27 19:19:22.794723+00', '2026-05-27 19:19:22.794723+00', '2026-05-27 19:19:22.794723+00', '{"eTag": "\"5e00be6d8212cc334f09cede27a988bc\"", "size": 14614, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T19:19:23.000Z", "contentLength": 14614, "httpStatusCode": 200}', '265a348d-8759-4a8d-a0ab-6ce283ced925', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('a85f8189-b6bc-433d-add4-a70c6136cb22', 'avatars', 'staff/2fed465a-7ac1-426c-84d0-585df1c87de0-1779985628486', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-28 16:27:10.250575+00', '2026-05-28 16:27:10.250575+00', '2026-05-28 16:27:10.250575+00', '{"eTag": "\"79ac87a0f6061c2e57e9e327b4690d97\"", "size": 50220, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-28T16:27:11.000Z", "contentLength": 50220, "httpStatusCode": 200}', 'c58c6934-e89f-45c4-bcb6-2d2db3eb88d9', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('d979362a-2b57-40e3-a7ab-a27e030561d7', 'client-logos', 'projects/project_1779989367486.png', '64ee608f-721a-43c1-997e-97936f75ff87', '2026-05-28 17:29:30.582552+00', '2026-05-28 17:29:30.582552+00', '2026-05-28 17:29:30.582552+00', '{"eTag": "\"3eddd5e6cc6ffb204d2eeb3a11492896\"", "size": 541061, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-28T17:29:31.000Z", "contentLength": 541061, "httpStatusCode": 200}', 'b6386570-e004-4a7c-b7ee-aa9b71b2751a', '64ee608f-721a-43c1-997e-97936f75ff87', '{}'),
	('b75f3d20-298e-40e0-a94b-8018c9a1608b', 'client-logos', 'logos/logo_1783631628331.png', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-09 21:13:49.025811+00', '2026-07-09 21:13:49.025811+00', '2026-07-09 21:13:49.025811+00', '{"eTag": "\"4d7cdbe42d527cdf3844afd7204135e9\"", "size": 1259, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-09T21:13:49.000Z", "contentLength": 1259, "httpStatusCode": 200}', '98490779-0050-488c-b19e-406d6211ac61', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('157bfb00-63bb-46b3-aebf-e562e55aa5fa', 'client-logos', 'logos/1779994681881.png', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-28 18:58:04.090177+00', '2026-05-28 18:58:04.090177+00', '2026-05-28 18:58:04.090177+00', '{"eTag": "\"559e3957fd69ba00debd9852b43b150f\"", "size": 3718, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-28T18:58:05.000Z", "contentLength": 3718, "httpStatusCode": 200}', 'eda8d61e-d971-45e7-99e8-95c264a474db', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('097e9356-c768-4eb0-9ee7-18d46f4ef1b1', 'avatars', 'avatars/1779994735075_a5gcfn.webp', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '2026-05-28 18:58:57.87223+00', '2026-05-28 18:58:57.87223+00', '2026-05-28 18:58:57.87223+00', '{"eTag": "\"5e00be6d8212cc334f09cede27a988bc\"", "size": 14614, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-05-28T18:58:58.000Z", "contentLength": 14614, "httpStatusCode": 200}', '0e97087d-d8e8-45d9-bafb-27b6f7c2a729', '05c13c7a-3c7b-4a21-9b40-eaf343f38142', '{}'),
	('023e3c73-b193-4c65-97d1-2222c28d6f5c', 'client-logos', 'logos/banner_1783631628947.jpg', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-09 21:13:49.736808+00', '2026-07-09 21:13:49.736808+00', '2026-07-09 21:13:49.736808+00', '{"eTag": "\"b4e5316b9d4e7cccfe16992646475d1f\"", "size": 507079, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-09T21:13:50.000Z", "contentLength": 507079, "httpStatusCode": 200}', '62448c03-0520-49d8-a1ee-30a9f015f341', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('92fa1670-3d14-4b82-989f-44bb53d02c67', 'client-logos', 'logos/1779996346122.jpg', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-05-28 19:25:46.704794+00', '2026-05-28 19:25:46.704794+00', '2026-05-28 19:25:46.704794+00', '{"eTag": "\"f74816cc2f85378c88065269e81a0795\"", "size": 158195, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-28T19:25:47.000Z", "contentLength": 158195, "httpStatusCode": 200}', '5339786a-5034-48e6-818c-e4ab880db269', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('d7083b1c-f14c-4b36-82ce-33698b04f71b', 'client-logos', 'logos/banner_1783704119064.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:22:00.462459+00', '2026-07-10 17:22:00.462459+00', '2026-07-10 17:22:00.462459+00', '{"eTag": "\"593ff89f3758a975fb8f2af42f347272\"", "size": 550398, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:22:01.000Z", "contentLength": 550398, "httpStatusCode": 200}', 'a4405e5f-a7a0-46d0-b524-6553eef6b2d8', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('917582a3-5e51-475b-90cf-8ae259abbc9f', 'client-logos', 'projects/project_1779996937174.jpg', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', '2026-05-28 19:35:38.090568+00', '2026-05-28 19:35:38.090568+00', '2026-05-28 19:35:38.090568+00', '{"eTag": "\"f74816cc2f85378c88065269e81a0795\"", "size": 158195, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-28T19:35:39.000Z", "contentLength": 158195, "httpStatusCode": 200}', 'a4d055ed-6cd5-4a62-8a7b-3303ea96dcf6', '6ccbf9a0-634f-4a94-a6ac-9c1187a6557a', '{}'),
	('76a28162-4fca-41e4-b18d-589cf1f2ce44', 'client-logos', 'logos/1779998097715.png', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-05-28 19:54:59.849932+00', '2026-05-28 19:54:59.849932+00', '2026-05-28 19:54:59.849932+00', '{"eTag": "\"f5b5beb3885f3417b7bcd60c61f612fe\"", "size": 2058, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-28T19:55:00.000Z", "contentLength": 2058, "httpStatusCode": 200}', '8d568e97-c9e7-4f41-b634-9bac79adf810', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('ce00a668-727d-4cf5-826b-f8048743f9f3', 'client-logos', 'logos/1781627237332.png', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-16 16:27:18.558429+00', '2026-06-16 16:27:18.558429+00', '2026-06-16 16:27:18.558429+00', '{"eTag": "\"3eddd5e6cc6ffb204d2eeb3a11492896\"", "size": 541061, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-16T16:27:19.000Z", "contentLength": 541061, "httpStatusCode": 200}', '44fa09a6-f3ed-46fd-927e-8a1177f86287', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('5f7e2217-405a-4c19-a965-b1b12fb16634', 'client-logos', 'logos/banner_1781628078511.png', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-16 16:41:23.040585+00', '2026-06-16 16:41:23.040585+00', '2026-06-16 16:41:23.040585+00', '{"eTag": "\"1b492568cb2da96ef000a7159d4d6cbc\"", "size": 2810291, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-16T16:41:23.000Z", "contentLength": 2810291, "httpStatusCode": 200}', '888b6aff-52cc-4a9a-944f-72b3c64da673', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('9a5aa7ca-9382-4125-bf96-d41e62d07433', 'client-logos', 'logos/logo_1782410129490.png', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 17:55:32.066211+00', '2026-06-25 17:55:32.066211+00', '2026-06-25 17:55:32.066211+00', '{"eTag": "\"80c0672505ab42b521adbdbf6b5835b7\"", "size": 4448, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T17:55:33.000Z", "contentLength": 4448, "httpStatusCode": 200}', 'efed6e82-619d-4a12-a155-20e9bd795a7a', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('f28a822b-86ad-4aa5-b87a-0d0f43a11858', 'client-logos', 'logos/banner_1782410129982.webp', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 17:55:32.503042+00', '2026-06-25 17:55:32.503042+00', '2026-06-25 17:55:32.503042+00', '{"eTag": "\"231a498c06cadfbc2c5c45fa9d91e08f\"", "size": 134624, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T17:55:33.000Z", "contentLength": 134624, "httpStatusCode": 200}', 'cc006758-0ef9-4b8c-b2d4-2673f10bac6a', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('49b71832-b296-4fce-a28a-e0dbea9c3dbe', 'client-logos', 'logos/banner_1782410211697.jpg', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 17:56:54.108286+00', '2026-06-25 17:56:54.108286+00', '2026-06-25 17:56:54.108286+00', '{"eTag": "\"f90be472474f0ddc94359749617b99e1\"", "size": 30167, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T17:56:55.000Z", "contentLength": 30167, "httpStatusCode": 200}', '73040542-8e7a-47f8-a166-eac8c1577dd0', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('09e7a50e-7392-4e81-9b9d-50a9add15729', 'client-logos', 'logos/logo_1783702048166.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 16:47:32.448205+00', '2026-07-10 16:47:32.448205+00', '2026-07-10 16:47:32.448205+00', '{"eTag": "\"ed8ae87e0c2461271f6d39acb51269a5\"", "size": 21446, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:47:33.000Z", "contentLength": 21446, "httpStatusCode": 200}', 'e0bb2ab5-001e-4994-81bc-47fab014f5ba', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('622dd340-0a09-4cee-9f4e-b54ba0876809', 'client-logos', 'logos/logo_1782410270945.jpg', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 17:57:53.498783+00', '2026-06-25 17:57:53.498783+00', '2026-06-25 17:57:53.498783+00', '{"eTag": "\"9f8a527e9f53628b93236d13a83f8aa0\"", "size": 8024, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T17:57:54.000Z", "contentLength": 8024, "httpStatusCode": 200}', '13e12904-1d31-4a39-9f54-12462cfc9d2f', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('50923886-38e7-4df0-829a-05c9e36916e3', 'client-logos', 'logos/banner_1782410316842.webp', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 17:58:39.378567+00', '2026-06-25 17:58:39.378567+00', '2026-06-25 17:58:39.378567+00', '{"eTag": "\"231a498c06cadfbc2c5c45fa9d91e08f\"", "size": 134624, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T17:58:40.000Z", "contentLength": 134624, "httpStatusCode": 200}', '6ecb6e49-a9a1-44ab-88af-d22bbe7a6436', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('2fc04aa0-00dc-47f5-9e6f-acda1c441084', 'client-logos', 'logos/banner_1783702052833.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 16:47:43.736038+00', '2026-07-10 16:47:43.736038+00', '2026-07-10 16:47:43.736038+00', '{"eTag": "\"b275f0961f32ffe583c9e5efd8e17bf0\"", "size": 1511014, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:47:44.000Z", "contentLength": 1511014, "httpStatusCode": 200}', 'e0bcc5f8-f806-4f99-b71d-c192ac39fe13', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('41d831bd-0d25-4c81-bc50-7c01573f80f4', 'client-logos', 'logos/logo_1782414315864.jpg', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 19:05:18.888121+00', '2026-06-25 19:05:18.888121+00', '2026-06-25 19:05:18.888121+00', '{"eTag": "\"e0e9fb2a3ca88bc8d7fe80a3cda902a7\"", "size": 312310, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T19:05:19.000Z", "contentLength": 312310, "httpStatusCode": 200}', '88357bbc-3b3d-4f4a-b351-61b3e8fc206f', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('553f8b91-6045-456a-ad78-6eba8b96ab2a', 'client-logos', 'logos/banner_1782414316610.png', '0629526c-afb6-45c7-a436-5607c4aab18d', '2026-06-25 19:05:19.906703+00', '2026-06-25 19:05:19.906703+00', '2026-06-25 19:05:19.906703+00', '{"eTag": "\"6ea31fdad31391b3a823b17639d9e8ba\"", "size": 1073664, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-25T19:05:20.000Z", "contentLength": 1073664, "httpStatusCode": 200}', '3dfc35cc-52cb-4219-a3ae-3d5afc488784', '0629526c-afb6-45c7-a436-5607c4aab18d', '{}'),
	('a9640346-4e4a-4efc-a8ea-20d944772215', 'client-logos', 'logos/logo_1783702456626.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 16:54:24.984302+00', '2026-07-10 16:54:24.984302+00', '2026-07-10 16:54:24.984302+00', '{"eTag": "\"f67d722cc662d1f61e8913efd4caf316\"", "size": 420926, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:54:25.000Z", "contentLength": 420926, "httpStatusCode": 200}', '25a0c1a9-2491-4941-b7ad-f20d117a111c', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('bdb568c3-7087-4f9c-b9af-86e1ef34d02d', 'client-logos', 'logos/banner_1783702467396.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 16:54:28.233378+00', '2026-07-10 16:54:28.233378+00', '2026-07-10 16:54:28.233378+00', '{"eTag": "\"d56312d8e024bb8fa5b8c5c075207f8d\"", "size": 6996, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T16:54:29.000Z", "contentLength": 6996, "httpStatusCode": 200}', '27ac19c5-7a2f-4b2e-b43c-1ae8125ce8bc', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('ed718d55-7ebc-4bc5-b5ed-52573fbdf37d', 'client-logos', 'logos/logo_1783703364963.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:09:25.328153+00', '2026-07-10 17:09:25.328153+00', '2026-07-10 17:09:25.328153+00', '{"eTag": "\"3f885ec65e46a15cdd3b2847c9df4439\"", "size": 4216, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:09:26.000Z", "contentLength": 4216, "httpStatusCode": 200}', '07646fdf-cf3b-4549-a8bd-3f3882849940', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('7ec5835b-b169-4397-8db8-35f4158d8b02', 'client-logos', 'logos/banner_1783703365517.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:09:34.097296+00', '2026-07-10 17:09:34.097296+00', '2026-07-10 17:09:34.097296+00', '{"eTag": "\"d9d2bc75facdecd50e7172d173252479\"", "size": 978212, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:09:35.000Z", "contentLength": 978212, "httpStatusCode": 200}', 'b7b367f7-f8fb-445e-853d-c4c3d4834f1b', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('f88e21e8-590f-4761-947e-44b2cf2f9235', 'client-logos', 'logos/logo_1783704272974.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:24:33.613414+00', '2026-07-10 17:24:33.613414+00', '2026-07-10 17:24:33.613414+00', '{"eTag": "\"86e5743962098b34648e181e64d53da5\"", "size": 3044, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:24:34.000Z", "contentLength": 3044, "httpStatusCode": 200}', '39557c3c-f1b0-4713-8f61-a5ab33fd2fdf', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('a557c107-d60f-4c81-af2e-47dfa96d019e', 'client-logos', 'logos/banner_1783704273736.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:24:34.600324+00', '2026-07-10 17:24:34.600324+00', '2026-07-10 17:24:34.600324+00', '{"eTag": "\"73c76321b7be8958c0d3e875dcb4867c\"", "size": 124018, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:24:35.000Z", "contentLength": 124018, "httpStatusCode": 200}', '65acabfc-24c2-4937-879a-92083604f54b', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('4c71cf6d-05a9-4377-beaa-ee9f812af4d0', 'client-logos', 'logos/banner_1783704433268.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:27:23.182554+00', '2026-07-10 17:27:23.182554+00', '2026-07-10 17:27:23.182554+00', '{"eTag": "\"b7127383df3f2eebd595078aa3340b82\"", "size": 44310, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:27:24.000Z", "contentLength": 44310, "httpStatusCode": 200}', '984c7acb-38f5-4e45-8560-bc32a8c391c1', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('3e524b4c-39e9-4aa9-b794-be2c3c0d6ea1', 'client-logos', 'logos/logo_1783705295269.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:41:35.80456+00', '2026-07-10 17:41:35.80456+00', '2026-07-10 17:41:35.80456+00', '{"eTag": "\"e3b7b7babfa6cc686f7009d90d2f2e9e\"", "size": 3402, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:41:36.000Z", "contentLength": 3402, "httpStatusCode": 200}', '8e614766-8994-4f9b-b5bc-09bf0da73f7d', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('bf10939b-772c-4f03-a485-106c81552882', 'client-logos', 'logos/banner_1783706042719.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-10 17:54:04.135473+00', '2026-07-10 17:54:04.135473+00', '2026-07-10 17:54:04.135473+00', '{"eTag": "\"169e19216dfe89dbf6149565aee25e02\"", "size": 158882, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-10T17:54:05.000Z", "contentLength": 158882, "httpStatusCode": 200}', 'c3ca78d1-563e-4f63-b710-46c3848387f4', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('fe1ab9fa-ebdb-48b3-a06e-d01ec19cd3c4', 'client-logos', 'logos/logo_1784051998422.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 17:59:59.612127+00', '2026-07-14 17:59:59.612127+00', '2026-07-14 17:59:59.612127+00', '{"eTag": "\"d3d8a503d59a444ff7811ee15e49798e\"", "size": 4684, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:00:00.000Z", "contentLength": 4684, "httpStatusCode": 200}', '35aaa6b6-dbdc-477b-b3e6-1c402d00569a', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('abd045f2-ae03-40b9-9ac8-a67658cb9d85', 'client-logos', 'logos/banner_1784052000563.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 18:00:03.197559+00', '2026-07-14 18:00:03.197559+00', '2026-07-14 18:00:03.197559+00', '{"eTag": "\"cb1c4867c4edc9fd51e7167c085ca323\"", "size": 1253008, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:00:04.000Z", "contentLength": 1253008, "httpStatusCode": 200}', 'd23aa89a-6128-459c-aafe-f97c55125dfd', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('b09380e3-549a-4277-af30-4f9ed168c9ac', 'client-logos', 'logos/logo_1784052036472.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 18:00:35.904789+00', '2026-07-14 18:00:35.904789+00', '2026-07-14 18:00:35.904789+00', '{"eTag": "\"b762225d3f1edfc28408c61b0e8bda67\"", "size": 5034, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:00:36.000Z", "contentLength": 5034, "httpStatusCode": 200}', 'ccd9d8de-fe75-4dde-a966-ee1a89ed1274', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('fa2ddbd2-035e-4386-9f92-c108cc49e3b0', 'client-logos', 'logos/banner_1784052036811.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 18:00:37.082144+00', '2026-07-14 18:00:37.082144+00', '2026-07-14 18:00:37.082144+00', '{"eTag": "\"3b4ff4aaf09f434c978c8919e75e9fff\"", "size": 875630, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:00:38.000Z", "contentLength": 875630, "httpStatusCode": 200}', '8fede695-3154-47ad-a698-a1a885ed0cc2', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('0522b7ea-295d-4eb3-81e9-4d51052e4731', 'client-logos', 'logos/logo_1784052079529.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 18:01:19.288174+00', '2026-07-14 18:01:19.288174+00', '2026-07-14 18:01:19.288174+00', '{"eTag": "\"e302e60897bc74fa3c290908c41aedd3\"", "size": 5386, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:01:20.000Z", "contentLength": 5386, "httpStatusCode": 200}', '7995855d-926b-4b97-80e1-5d971e3adcfa', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('a75acdf3-ea15-48e3-b41d-34380659843c', 'client-logos', 'logos/banner_1784052080242.webp', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 18:01:20.476738+00', '2026-07-14 18:01:20.476738+00', '2026-07-14 18:01:20.476738+00', '{"eTag": "\"935e9d74db83a0af7b800b94ec729d9b\"", "size": 1011220, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:01:21.000Z", "contentLength": 1011220, "httpStatusCode": 200}', 'a4d9d875-f9da-411b-b577-1d4b8fe8d206', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('63bdbbe7-5c3c-4cc3-8e1b-75ca21f7f45d', 'client-logos', 'logos/logo_1784052400014.png', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 18:06:39.69639+00', '2026-07-14 18:06:39.69639+00', '2026-07-14 18:06:39.69639+00', '{"eTag": "\"f8843957001cf0cbf531abdeea795223\"", "size": 5971, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:06:40.000Z", "contentLength": 5971, "httpStatusCode": 200}', 'd2667907-0c4b-4cf8-bff1-706b080e7337', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('9646a1e5-da83-43f0-a80a-852fcf38ff92', 'client-logos', 'logos/banner_1784052400601.jpg', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '2026-07-14 18:06:41.330016+00', '2026-07-14 18:06:41.330016+00', '2026-07-14 18:06:41.330016+00', '{"eTag": "\"4a7a7201be8385dae47330f670e2d26a\"", "size": 599854, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T18:06:42.000Z", "contentLength": 599854, "httpStatusCode": 200}', 'fa1ba846-17e2-455a-9251-be4679204246', '1b33a1a2-59e1-4fcb-9096-2120f07677e8', '{}'),
	('37a84b9c-c437-4ed3-a3c6-6970e9e79806', 'client-logos', 'logos/banner_1784071589520.jpg', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-14 23:26:31.024491+00', '2026-07-14 23:26:31.024491+00', '2026-07-14 23:26:31.024491+00', '{"eTag": "\"40a523eb7abc725ac0f03a62d6e78197\"", "size": 37995, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-14T23:26:31.000Z", "contentLength": 37995, "httpStatusCode": 200}', 'c86312c7-5ef7-4587-b535-42a91cf4dafa', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '{}'),
	('6db4a90c-2278-45a1-9e7e-6c81625d08b0', 'client-logos', 'projects/project_1784073746778.jpg', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '2026-07-15 00:02:28.318742+00', '2026-07-15 00:02:28.318742+00', '2026-07-15 00:02:28.318742+00', '{"eTag": "\"b407b3d6397f2a286f179bf1ec37ffd0\"", "size": 360395, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-15T00:02:29.000Z", "contentLength": 360395, "httpStatusCode": 200}', '0b77da4f-2cb6-4d69-953b-24ab79159213', 'e1f33a82-a3a0-4fd2-99e6-4a94723c3c53', '{}'),
	('edfa4ac1-c221-493b-b9b3-bdf841457791', 'client-logos', 'projects/project_1784073781911.png', '473016e7-f5e4-451e-a889-8d19a11484f2', '2026-07-15 00:03:02.76723+00', '2026-07-15 00:03:02.76723+00', '2026-07-15 00:03:02.76723+00', '{"eTag": "\"6ef5aaf576651d1472d6e093061bac27\"", "size": 876512, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-15T00:03:03.000Z", "contentLength": 876512, "httpStatusCode": 200}', '5d835d0d-e6b0-4cde-a1c7-5368f0b45f57', '473016e7-f5e4-451e-a889-8d19a11484f2', '{}'),
	('55b4dab0-717f-4398-a06d-d4df2ec0188b', 'client-logos', 'logos/logo_1784220562817.png', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-16 16:49:23.761484+00', '2026-07-16 16:49:23.761484+00', '2026-07-16 16:49:23.761484+00', '{"eTag": "\"4574478c5d3c710c9e6d4fcf9df60e77\"", "size": 19095, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T16:49:24.000Z", "contentLength": 19095, "httpStatusCode": 200}', 'c8b815cb-5c3b-4044-98aa-9d244d34c66b', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '{}'),
	('4c019a0d-57d9-4fdc-8ce3-6ddbcc3664c3', 'client-logos', 'logos/banner_1784220563494.jpg', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '2026-07-16 16:49:24.233054+00', '2026-07-16 16:49:24.233054+00', '2026-07-16 16:49:24.233054+00', '{"eTag": "\"caeecdf821a2d3bf90c09afa3f6c39de\"", "size": 96462, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-16T16:49:25.000Z", "contentLength": 96462, "httpStatusCode": 200}', 'f00cdb97-a14d-4804-b284-f74be168dbc3', '7e6ae7be-9b76-4400-94b1-a6571016ca87', '{}'),
	('88866617-6a6d-4a4e-9d4f-39e36b9ed5c3', 'client-logos', 'logos/banner_1784562964818.jpeg', '6901712f-b020-4eec-83eb-13d1eff277c0', '2026-07-20 15:56:05.157301+00', '2026-07-20 15:56:05.157301+00', '2026-07-20 15:56:05.157301+00', '{"eTag": "\"c64001fad7c35088bad4284a1c68be2c\"", "size": 36963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-20T15:56:06.000Z", "contentLength": 36963, "httpStatusCode": 200}', '96b11cc0-1556-411d-b58e-3419dd4988b5', '6901712f-b020-4eec-83eb-13d1eff277c0', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

INSERT INTO "supabase_functions"."hooks" ("id", "hook_table_id", "hook_name", "created_at", "request_id") VALUES
	(1, 18090, 'notificaciones-nexus', '2026-05-25 23:58:59.83141+00', 1),
	(2, 18090, 'notificaciones-nexus', '2026-05-25 23:59:52.686629+00', 2),
	(3, 18090, 'notificaciones-nexus', '2026-05-26 00:00:28.995533+00', 3),
	(4, 18090, 'notificaciones-nexus', '2026-05-26 00:01:03.584995+00', 4),
	(5, 18090, 'notificaciones-nexus', '2026-05-26 00:02:22.459562+00', 5),
	(6, 18090, 'notificaciones-nexus', '2026-05-26 17:03:35.876768+00', 6),
	(7, 18090, 'notificaciones-nexus', '2026-05-26 17:04:01.706859+00', 7),
	(8, 18090, 'notificaciones-nexus', '2026-05-26 17:04:32.196996+00', 8),
	(9, 18090, 'notificaciones-nexus', '2026-05-26 19:28:31.62019+00', 9),
	(10, 18090, 'notificaciones-nexus', '2026-05-26 20:11:58.851718+00', 10),
	(11, 18090, 'notificaciones-nexus', '2026-05-26 20:14:54.291955+00', 11),
	(12, 18090, 'notificaciones-nexus', '2026-05-26 20:20:27.162863+00', 12),
	(13, 18090, 'notificaciones-nexus', '2026-05-26 20:20:30.357708+00', 13),
	(14, 18090, 'notificaciones-nexus', '2026-05-26 20:20:33.858697+00', 14),
	(15, 18090, 'notificaciones-nexus', '2026-05-26 20:21:04.910089+00', 15),
	(16, 18090, 'notificaciones-nexus', '2026-05-26 20:24:49.134893+00', 16),
	(17, 18090, 'notificaciones-nexus', '2026-05-26 20:27:02.811111+00', 17),
	(18, 18090, 'notificaciones-nexus', '2026-05-26 20:29:50.876434+00', 18),
	(19, 18090, 'notificaciones-nexus', '2026-05-26 20:29:50.876434+00', 19),
	(20, 18090, 'notificaciones-nexus', '2026-05-26 20:30:41.25615+00', 20),
	(21, 18090, 'notificaciones-nexus', '2026-05-26 20:30:41.25615+00', 21),
	(22, 18090, 'notificaciones-nexus', '2026-05-26 21:02:52.985676+00', 22),
	(23, 18090, 'notificaciones-nexus', '2026-05-26 21:02:53.139157+00', 23),
	(24, 18090, 'notificaciones-nexus', '2026-05-26 21:02:53.270803+00', 24),
	(25, 18090, 'notificaciones-nexus', '2026-05-26 22:37:20.369776+00', 25),
	(26, 18090, 'notificaciones-nexus', '2026-05-26 22:37:30.382003+00', 26),
	(27, 18090, 'notificaciones-nexus', '2026-05-26 22:37:37.779919+00', 27),
	(28, 18090, 'notificaciones-nexus', '2026-05-26 22:46:41.533446+00', 28),
	(29, 18090, 'notificaciones-nexus', '2026-05-26 22:46:41.533446+00', 29),
	(30, 18090, 'notificaciones-nexus', '2026-05-26 22:46:41.533446+00', 30),
	(31, 18090, 'notificaciones-nexus', '2026-05-26 22:47:08.110073+00', 31),
	(32, 18090, 'notificaciones-nexus', '2026-05-26 22:47:08.110073+00', 32),
	(33, 18090, 'notificaciones-nexus', '2026-05-26 22:47:08.110073+00', 33),
	(34, 18090, 'notificaciones-nexus', '2026-05-26 23:06:27.437962+00', 34),
	(35, 18090, 'notificaciones-nexus', '2026-05-26 23:06:27.437962+00', 35),
	(36, 18090, 'notificaciones-nexus', '2026-05-26 23:06:27.437962+00', 36),
	(37, 18090, 'notificaciones-nexus', '2026-05-26 23:12:09.18414+00', 37),
	(38, 18090, 'notificaciones-nexus', '2026-05-26 23:12:09.18414+00', 38),
	(39, 18090, 'notificaciones-nexus', '2026-05-26 23:12:09.18414+00', 39),
	(40, 18090, 'notificaciones-nexus', '2026-05-26 23:26:06.152415+00', 40),
	(41, 18090, 'notificaciones-nexus', '2026-05-26 23:26:20.836329+00', 41),
	(42, 18090, 'notificaciones-nexus', '2026-05-26 23:26:36.401057+00', 42),
	(43, 18090, 'notificaciones-nexus', '2026-05-26 23:26:36.401057+00', 43),
	(44, 18090, 'notificaciones-nexus', '2026-05-26 23:26:36.401057+00', 44),
	(45, 18090, 'notificaciones-nexus', '2026-05-26 23:27:23.73667+00', 45),
	(46, 18090, 'notificaciones-nexus', '2026-05-26 23:27:23.73667+00', 46),
	(47, 18090, 'notificaciones-nexus', '2026-05-26 23:27:23.73667+00', 47),
	(48, 18090, 'notificaciones-nexus', '2026-05-26 23:28:08.408528+00', 48),
	(49, 18090, 'notificaciones-nexus', '2026-05-26 23:33:39.256865+00', 49),
	(50, 18090, 'notificaciones-nexus', '2026-05-26 23:35:04.780003+00', 50),
	(51, 18090, 'notificaciones-nexus', '2026-05-26 23:35:22.856218+00', 51),
	(52, 18090, 'notificaciones-nexus', '2026-05-26 23:35:31.057384+00', 52),
	(53, 18090, 'notificaciones-nexus', '2026-05-26 23:35:31.057384+00', 53),
	(54, 18090, 'notificaciones-nexus', '2026-05-26 23:35:31.057384+00', 54),
	(55, 18090, 'notificaciones-nexus', '2026-05-26 23:35:49.425876+00', 55),
	(56, 18090, 'notificaciones-nexus', '2026-05-26 23:35:49.425876+00', 56),
	(57, 18090, 'notificaciones-nexus', '2026-05-26 23:35:49.425876+00', 57),
	(58, 18090, 'notificaciones-nexus', '2026-05-26 23:36:00.12963+00', 58),
	(59, 18090, 'notificaciones-nexus', '2026-05-26 23:36:00.12963+00', 59),
	(60, 18090, 'notificaciones-nexus', '2026-05-26 23:36:00.12963+00', 60),
	(61, 18090, 'notificaciones-nexus', '2026-05-26 23:47:51.657472+00', 61),
	(62, 18090, 'notificaciones-nexus', '2026-05-26 23:47:51.657472+00', 62),
	(63, 18090, 'notificaciones-nexus', '2026-05-26 23:47:51.657472+00', 63),
	(64, 18090, 'notificaciones-nexus', '2026-05-27 00:12:08.606936+00', 64),
	(65, 18090, 'notificaciones-nexus', '2026-05-27 00:12:21.030604+00', 65),
	(66, 18090, 'notificaciones-nexus', '2026-05-27 00:12:34.935593+00', 66),
	(67, 18090, 'notificaciones-nexus', '2026-05-27 00:13:21.627408+00', 67),
	(68, 18090, 'notificaciones-nexus', '2026-05-27 00:13:54.003853+00', 68),
	(69, 18090, 'notificaciones-nexus', '2026-05-27 00:14:23.857597+00', 69),
	(70, 18090, 'notificaciones-nexus', '2026-05-27 00:14:37.393304+00', 70),
	(71, 18090, 'notificaciones-nexus', '2026-05-27 00:14:44.267895+00', 71),
	(72, 18090, 'notificaciones-nexus', '2026-05-27 00:15:07.261839+00', 72),
	(73, 18090, 'notificaciones-nexus', '2026-05-27 00:58:00.835698+00', 73),
	(74, 18090, 'notificaciones-nexus', '2026-05-27 00:58:58.47324+00', 74),
	(75, 18090, 'notificaciones-nexus', '2026-05-27 00:59:39.48259+00', 75),
	(76, 18090, 'notificaciones-nexus', '2026-05-27 01:00:02.323877+00', 76),
	(77, 18090, 'notificaciones-nexus', '2026-05-27 01:00:02.323877+00', 77),
	(78, 18090, 'notificaciones-nexus', '2026-05-27 01:00:33.868125+00', 78),
	(79, 18090, 'notificaciones-nexus', '2026-05-27 01:00:33.868125+00', 79),
	(80, 18090, 'notificaciones-nexus', '2026-05-27 01:00:53.498045+00', 80),
	(81, 18090, 'notificaciones-nexus', '2026-05-27 01:02:05.307028+00', 81),
	(82, 18090, 'notificaciones-nexus', '2026-05-27 01:02:11.846558+00', 82),
	(83, 18090, 'notificaciones-nexus', '2026-05-27 01:02:13.092007+00', 83),
	(84, 18090, 'notificaciones-nexus', '2026-05-27 01:02:13.216851+00', 84),
	(85, 18090, 'notificaciones-nexus', '2026-05-27 01:02:19.371708+00', 85),
	(86, 18090, 'notificaciones-nexus', '2026-05-27 01:02:19.371708+00', 86),
	(87, 18090, 'notificaciones-nexus', '2026-05-27 01:02:27.005962+00', 87),
	(88, 18090, 'notificaciones-nexus', '2026-05-27 01:02:27.005962+00', 88),
	(89, 18090, 'notificaciones-nexus', '2026-05-27 01:14:31.668526+00', 89),
	(90, 18090, 'notificaciones-nexus', '2026-05-27 17:01:02.848381+00', 90),
	(91, 18090, 'notificaciones-nexus', '2026-05-27 17:01:13.880369+00', 91),
	(92, 18090, 'notificaciones-nexus', '2026-05-27 17:01:13.880369+00', 92),
	(93, 18090, 'notificaciones-nexus', '2026-05-27 19:33:36.107941+00', 93),
	(94, 18090, 'notificaciones-nexus', '2026-05-27 19:33:46.357157+00', 94),
	(95, 18090, 'notificaciones-nexus', '2026-05-27 19:35:53.594943+00', 95),
	(96, 18090, 'notificaciones-nexus', '2026-05-27 19:35:55.766118+00', 96),
	(97, 18090, 'notificaciones-nexus', '2026-05-27 19:36:35.227881+00', 97),
	(98, 18090, 'notificaciones-nexus', '2026-05-27 19:36:42.001163+00', 98),
	(99, 18090, 'notificaciones-nexus', '2026-05-27 19:37:04.931888+00', 99),
	(100, 18090, 'notificaciones-nexus', '2026-05-28 17:31:55.276128+00', 100),
	(101, 18090, 'notificaciones-nexus', '2026-05-28 17:32:10.166515+00', 101),
	(102, 18090, 'notificaciones-nexus', '2026-05-28 17:32:15.231015+00', 102),
	(103, 18090, 'notificaciones-nexus', '2026-05-28 17:32:22.619462+00', 103),
	(104, 18090, 'notificaciones-nexus', '2026-05-28 19:43:50.666147+00', 104),
	(105, 18090, 'notificaciones-nexus', '2026-05-28 19:43:50.823879+00', 105),
	(106, 17638, 'notificacion-nueva-solicitud', '2026-06-23 23:03:31.315574+00', 106),
	(107, 17638, 'notificacion-nueva-solicitud', '2026-06-23 23:11:54.174271+00', 107),
	(108, 17638, 'notificacion-nueva-solicitud', '2026-06-23 23:20:52.131172+00', 108),
	(109, 17638, 'notificacion-nueva-solicitud', '2026-06-23 23:23:18.304136+00', 109),
	(110, 17638, 'notificacion-nueva-solicitud', '2026-06-23 23:28:26.329118+00', 110),
	(111, 17638, 'notificacion-nueva-solicitud', '2026-06-23 23:33:25.588259+00', 111),
	(112, 17638, 'notificacion-nueva-solicitud', '2026-06-23 23:38:28.267461+00', 112),
	(113, 17638, 'notificacion-nueva-solicitud', '2026-06-25 16:44:55.858374+00', 113),
	(114, 17638, 'notificacion-nueva-solicitud', '2026-06-25 16:57:57.039566+00', 114),
	(115, 17638, 'notificacion-nueva-solicitud', '2026-06-25 17:00:44.723713+00', 115),
	(116, 17638, 'notificacion-nueva-solicitud', '2026-06-25 17:16:20.767223+00', 116),
	(117, 17638, 'notificacion-nueva-solicitud', '2026-06-25 17:52:25.600775+00', 117),
	(118, 17638, 'notificacion-nueva-solicitud', '2026-06-25 18:12:14.539687+00', 118),
	(119, 17638, 'notificacion-nueva-solicitud', '2026-06-26 21:10:57.452473+00', 119),
	(120, 17638, 'notificacion-nueva-solicitud', '2026-06-26 21:13:45.416192+00', 120),
	(121, 17638, 'notificacion-nueva-solicitud', '2026-06-26 21:15:06.490518+00', 121),
	(122, 17638, 'notificacion-nueva-solicitud', '2026-06-26 21:17:05.141627+00', 122),
	(123, 17638, 'notificacion-nueva-solicitud', '2026-06-26 21:18:16.906003+00', 123),
	(124, 17638, 'notificacion-nueva-solicitud', '2026-07-01 16:28:36.608867+00', 124),
	(125, 17638, 'notificacion-nueva-solicitud', '2026-07-06 16:38:10.820837+00', 125),
	(126, 17638, 'notificacion-nueva-solicitud', '2026-07-06 16:43:55.448025+00', 126),
	(127, 18090, 'notificaciones-nexus', '2026-07-06 16:51:29.198749+00', 127),
	(128, 18090, 'notificaciones-nexus', '2026-07-06 16:53:29.133653+00', 128),
	(129, 18090, 'notificaciones-nexus', '2026-07-06 16:54:42.484974+00', 129),
	(130, 18090, 'notificaciones-nexus', '2026-07-06 16:54:56.953438+00', 130),
	(131, 18090, 'notificaciones-nexus', '2026-07-06 16:55:26.516397+00', 131),
	(132, 18090, 'notificaciones-nexus', '2026-07-06 17:03:59.455428+00', 132),
	(133, 18090, 'notificaciones-nexus', '2026-07-06 17:05:15.605457+00', 133),
	(134, 18090, 'notificaciones-nexus', '2026-07-06 17:06:53.712542+00', 134),
	(135, 18090, 'notificaciones-nexus', '2026-07-06 17:07:12.474575+00', 135),
	(136, 18090, 'notificaciones-nexus', '2026-07-06 17:07:24.206566+00', 136),
	(137, 18090, 'notificaciones-nexus', '2026-07-06 17:07:37.417821+00', 137),
	(138, 17638, 'notificacion-nueva-solicitud', '2026-07-06 17:18:47.386218+00', 138),
	(139, 18090, 'notificaciones-nexus', '2026-07-06 17:22:47.175821+00', 139),
	(140, 18090, 'notificaciones-nexus', '2026-07-06 17:23:00.89768+00', 140),
	(141, 18090, 'notificaciones-nexus', '2026-07-06 17:23:18.059605+00', 141),
	(142, 18090, 'notificaciones-nexus', '2026-07-06 17:23:23.437048+00', 142),
	(143, 18090, 'notificaciones-nexus', '2026-07-06 17:23:26.681157+00', 143),
	(144, 18090, 'notificaciones-nexus', '2026-07-06 17:23:33.998055+00', 144),
	(145, 17638, 'notificacion-nueva-solicitud', '2026-07-06 17:53:04.350551+00', 145),
	(146, 18090, 'notificaciones-nexus', '2026-07-06 17:57:58.16562+00', 146),
	(147, 18090, 'notificaciones-nexus', '2026-07-06 18:00:36.732415+00', 147),
	(148, 18090, 'notificaciones-nexus', '2026-07-06 18:02:23.927783+00', 148),
	(149, 18090, 'notificaciones-nexus', '2026-07-06 18:05:40.933257+00', 149),
	(150, 18090, 'notificaciones-nexus', '2026-07-06 18:06:50.549818+00', 150),
	(151, 18090, 'notificaciones-nexus', '2026-07-06 18:11:41.648726+00', 151),
	(152, 18090, 'notificaciones-nexus', '2026-07-06 18:15:43.743198+00', 152),
	(153, 18090, 'notificaciones-nexus', '2026-07-06 18:16:52.665622+00', 153),
	(154, 18090, 'notificaciones-nexus', '2026-07-06 18:19:15.743181+00', 154),
	(155, 18090, 'notificaciones-nexus', '2026-07-06 18:20:37.446045+00', 155),
	(156, 18090, 'notificaciones-nexus', '2026-07-06 18:21:45.74538+00', 156),
	(157, 18090, 'notificaciones-nexus', '2026-07-06 18:22:15.928952+00', 157),
	(158, 18090, 'notificaciones-nexus', '2026-07-06 18:22:30.681534+00', 158),
	(159, 18090, 'notificaciones-nexus', '2026-07-06 18:22:46.646421+00', 159),
	(160, 18090, 'notificaciones-nexus', '2026-07-06 18:38:09.61176+00', 160),
	(161, 18090, 'notificaciones-nexus', '2026-07-06 18:38:24.057659+00', 161),
	(162, 18090, 'notificaciones-nexus', '2026-07-06 18:38:56.199006+00', 162),
	(163, 18090, 'notificaciones-nexus', '2026-07-06 18:39:15.414579+00', 163),
	(164, 18090, 'notificaciones-nexus', '2026-07-06 19:10:09.695954+00', 164),
	(165, 17638, 'notificacion-nueva-solicitud', '2026-07-06 19:31:20.684026+00', 165),
	(166, 17638, 'notificacion-nueva-solicitud', '2026-07-06 19:34:32.289375+00', 166),
	(167, 17638, 'notificacion-nueva-solicitud', '2026-07-06 19:36:31.061074+00', 167),
	(168, 17638, 'notificacion-nueva-solicitud', '2026-07-06 19:37:36.947566+00', 168),
	(169, 18090, 'notificaciones-nexus', '2026-07-06 19:38:48.136002+00', 169),
	(170, 17638, 'notificacion-nueva-solicitud', '2026-07-06 19:39:46.852374+00', 170),
	(171, 17638, 'notificacion-nueva-solicitud', '2026-07-06 19:42:29.918248+00', 171),
	(172, 18090, 'notificaciones-nexus', '2026-07-06 19:43:17.130777+00', 172),
	(173, 18090, 'notificaciones-nexus', '2026-07-06 19:43:49.787974+00', 173),
	(174, 18090, 'notificaciones-nexus', '2026-07-06 19:44:56.470277+00', 174),
	(175, 18090, 'notificaciones-nexus', '2026-07-06 19:45:14.37877+00', 175),
	(176, 18090, 'notificaciones-nexus', '2026-07-06 19:56:43.594127+00', 176),
	(177, 17638, 'notificacion-nueva-solicitud', '2026-07-06 20:23:46.678923+00', 177),
	(178, 18090, 'notificaciones-nexus', '2026-07-06 20:34:02.111576+00', 178),
	(179, 18090, 'notificaciones-nexus', '2026-07-06 20:52:44.99026+00', 179),
	(180, 18090, 'notificaciones-nexus', '2026-07-06 20:54:46.247377+00', 180),
	(181, 17638, 'notificacion-nueva-solicitud', '2026-07-07 00:55:51.535378+00', 181),
	(182, 18090, 'notificaciones-nexus', '2026-07-07 23:30:07.343373+00', 182),
	(183, 18090, 'notificaciones-nexus', '2026-07-08 00:38:57.15368+00', 183),
	(184, 18090, 'notificaciones-nexus', '2026-07-08 00:38:57.662206+00', 184),
	(185, 18090, 'notificaciones-nexus', '2026-07-08 00:46:25.005128+00', 185),
	(186, 18090, 'notificaciones-nexus', '2026-07-08 00:46:34.986893+00', 186),
	(187, 18090, 'notificaciones-nexus', '2026-07-08 01:06:54.433386+00', 187),
	(188, 18090, 'notificaciones-nexus', '2026-07-08 01:06:55.025906+00', 188),
	(189, 18090, 'notificaciones-nexus', '2026-07-08 01:07:57.102835+00', 189),
	(190, 18090, 'notificaciones-nexus', '2026-07-08 01:14:50.82527+00', 190),
	(191, 18090, 'notificaciones-nexus', '2026-07-08 01:14:54.093427+00', 191),
	(192, 18090, 'notificaciones-nexus', '2026-07-08 01:15:03.115623+00', 192),
	(193, 18090, 'notificaciones-nexus', '2026-07-08 01:15:08.291443+00', 193),
	(194, 18090, 'notificaciones-nexus', '2026-07-08 01:20:15.071151+00', 194),
	(195, 18090, 'notificaciones-nexus', '2026-07-08 01:20:15.571823+00', 195),
	(196, 18090, 'notificaciones-nexus', '2026-07-08 15:41:28.109112+00', 196),
	(197, 18090, 'notificaciones-nexus', '2026-07-08 15:41:28.394812+00', 197),
	(198, 18090, 'notificaciones-nexus', '2026-07-08 15:42:44.092586+00', 198),
	(199, 18090, 'notificaciones-nexus', '2026-07-08 15:42:46.127382+00', 199),
	(200, 18090, 'notificaciones-nexus', '2026-07-08 15:42:47.643892+00', 200),
	(201, 18090, 'notificaciones-nexus', '2026-07-08 15:42:48.33503+00', 201),
	(202, 18090, 'notificaciones-nexus', '2026-07-08 15:43:55.966244+00', 202),
	(203, 18090, 'notificaciones-nexus', '2026-07-08 15:44:03.800487+00', 203),
	(204, 18090, 'notificaciones-nexus', '2026-07-08 17:22:11.842946+00', 204),
	(205, 18090, 'notificaciones-nexus', '2026-07-08 17:22:32.388149+00', 205),
	(206, 18090, 'notificaciones-nexus', '2026-07-08 17:22:53.615265+00', 206),
	(207, 18090, 'notificaciones-nexus', '2026-07-08 17:26:13.85655+00', 207),
	(208, 18090, 'notificaciones-nexus', '2026-07-08 17:26:30.017024+00', 208),
	(209, 18090, 'notificaciones-nexus', '2026-07-08 17:32:56.771541+00', 209),
	(210, 18090, 'notificaciones-nexus', '2026-07-08 17:33:07.106648+00', 210),
	(211, 18090, 'notificaciones-nexus', '2026-07-08 17:33:20.511421+00', 211),
	(212, 18090, 'notificaciones-nexus', '2026-07-08 17:33:25.030286+00', 212),
	(213, 18090, 'notificaciones-nexus', '2026-07-08 17:40:33.398645+00', 213),
	(214, 18090, 'notificaciones-nexus', '2026-07-08 17:42:56.16814+00', 214),
	(215, 18090, 'notificaciones-nexus', '2026-07-08 18:09:50.099327+00', 215),
	(216, 18090, 'notificaciones-nexus', '2026-07-08 18:09:50.286063+00', 216),
	(217, 18090, 'notificaciones-nexus', '2026-07-08 18:10:29.826013+00', 217),
	(218, 18090, 'notificaciones-nexus', '2026-07-08 18:10:29.975936+00', 218),
	(219, 18090, 'notificaciones-nexus', '2026-07-08 18:28:08.656662+00', 219),
	(220, 18090, 'notificaciones-nexus', '2026-07-08 18:38:29.885652+00', 220),
	(221, 18090, 'notificaciones-nexus', '2026-07-08 18:39:22.201337+00', 221),
	(222, 18090, 'notificaciones-nexus', '2026-07-08 18:39:46.940149+00', 222),
	(223, 18090, 'notificaciones-nexus', '2026-07-08 18:40:08.375707+00', 223),
	(224, 18090, 'notificaciones-nexus', '2026-07-08 18:40:17.762783+00', 224),
	(225, 18090, 'notificaciones-nexus', '2026-07-08 18:40:46.337586+00', 225),
	(226, 18090, 'notificaciones-nexus', '2026-07-08 18:41:06.033697+00', 226),
	(227, 18090, 'notificaciones-nexus', '2026-07-08 18:41:48.19672+00', 227),
	(228, 18090, 'notificaciones-nexus', '2026-07-08 18:41:58.931815+00', 228),
	(229, 18090, 'notificaciones-nexus', '2026-07-08 19:32:26.963821+00', 229),
	(230, 18090, 'notificaciones-nexus', '2026-07-08 19:32:29.805785+00', 230),
	(231, 17638, 'notificacion-nueva-solicitud', '2026-07-08 20:14:19.050329+00', 231),
	(232, 17638, 'notificacion-nueva-solicitud', '2026-07-08 20:36:41.617936+00', 232),
	(233, 18090, 'notificaciones-nexus', '2026-07-08 21:02:32.289057+00', 233),
	(234, 18090, 'notificaciones-nexus', '2026-07-08 21:02:42.543746+00', 234),
	(235, 17638, 'notificacion-nueva-solicitud', '2026-07-08 21:09:50.829845+00', 235),
	(236, 18090, 'notificaciones-nexus', '2026-07-08 21:11:48.503346+00', 236),
	(237, 18090, 'notificaciones-nexus', '2026-07-08 21:12:50.18195+00', 237),
	(238, 18090, 'notificaciones-nexus', '2026-07-08 21:12:50.607831+00', 238),
	(239, 18090, 'notificaciones-nexus', '2026-07-08 21:13:32.503274+00', 239),
	(240, 18090, 'notificaciones-nexus', '2026-07-08 21:14:41.488047+00', 240),
	(241, 18090, 'notificaciones-nexus', '2026-07-08 21:14:41.959859+00', 241),
	(242, 18090, 'notificaciones-nexus', '2026-07-08 21:15:32.037101+00', 242),
	(243, 18090, 'notificaciones-nexus', '2026-07-08 21:16:14.587597+00', 243),
	(244, 18090, 'notificaciones-nexus', '2026-07-08 21:16:16.912367+00', 244),
	(245, 18090, 'notificaciones-nexus', '2026-07-08 21:17:51.583495+00', 245),
	(246, 18090, 'notificaciones-nexus', '2026-07-08 21:18:16.111049+00', 246),
	(247, 18090, 'notificaciones-nexus', '2026-07-08 21:18:16.408952+00', 247),
	(248, 18090, 'notificaciones-nexus', '2026-07-08 21:19:14.893068+00', 248),
	(249, 17638, 'notificacion-nueva-solicitud', '2026-07-09 18:35:36.524388+00', 249),
	(250, 17638, 'notificacion-nueva-solicitud', '2026-07-09 23:32:34.737513+00', 250),
	(251, 17638, 'notificacion-nueva-solicitud', '2026-07-09 23:35:53.355593+00', 251),
	(252, 17638, 'notificacion-nueva-solicitud', '2026-07-09 23:37:31.521102+00', 252),
	(253, 17638, 'notificacion-nueva-solicitud', '2026-07-10 23:07:51.340109+00', 253),
	(254, 18090, 'notificaciones-nexus', '2026-07-10 23:08:24.735648+00', 254),
	(255, 18090, 'notificaciones-nexus', '2026-07-10 23:08:25.002887+00', 255),
	(256, 17638, 'notificacion-nueva-solicitud', '2026-07-10 23:10:25.974181+00', 256),
	(257, 17638, 'notificacion-nueva-solicitud', '2026-07-10 23:14:18.532253+00', 257),
	(258, 17638, 'notificacion-nueva-solicitud', '2026-07-13 16:33:44.037887+00', 258),
	(259, 17638, 'notificacion-nueva-solicitud', '2026-07-13 16:38:26.780445+00', 259),
	(260, 17638, 'notificacion-nueva-solicitud', '2026-07-13 16:46:28.198705+00', 260),
	(261, 17638, 'notificacion-nueva-solicitud', '2026-07-13 16:47:15.330492+00', 261),
	(262, 17638, 'notificacion-nueva-solicitud', '2026-07-13 16:47:34.413137+00', 262),
	(263, 17638, 'notificacion-nueva-solicitud', '2026-07-13 16:51:57.132201+00', 263),
	(264, 17638, 'notificacion-nueva-solicitud', '2026-07-13 16:52:27.715201+00', 264),
	(265, 17638, 'notificacion-nueva-solicitud', '2026-07-13 17:20:33.702025+00', 265),
	(266, 17638, 'notificacion-nueva-solicitud', '2026-07-14 18:05:29.336417+00', 266),
	(267, 18090, 'notificaciones-nexus', '2026-07-14 18:10:34.616626+00', 267),
	(268, 18090, 'notificaciones-nexus', '2026-07-14 18:11:22.211538+00', 268),
	(269, 18090, 'notificaciones-nexus', '2026-07-14 18:11:59.397086+00', 269),
	(270, 18090, 'notificaciones-nexus', '2026-07-14 18:12:05.610501+00', 270),
	(271, 18090, 'notificaciones-nexus', '2026-07-14 18:12:20.176232+00', 271),
	(272, 18090, 'notificaciones-nexus', '2026-07-14 18:12:20.176232+00', 272),
	(273, 18090, 'notificaciones-nexus', '2026-07-14 18:12:20.176232+00', 273),
	(274, 18090, 'notificaciones-nexus', '2026-07-14 18:12:20.176232+00', 274),
	(275, 18090, 'notificaciones-nexus', '2026-07-14 18:12:40.037045+00', 275),
	(276, 18090, 'notificaciones-nexus', '2026-07-14 18:12:40.037045+00', 276),
	(277, 18090, 'notificaciones-nexus', '2026-07-14 18:12:40.037045+00', 277),
	(278, 18090, 'notificaciones-nexus', '2026-07-14 18:12:40.037045+00', 278),
	(279, 18090, 'notificaciones-nexus', '2026-07-14 18:13:11.070776+00', 279),
	(280, 18090, 'notificaciones-nexus', '2026-07-14 18:13:11.599133+00', 280),
	(281, 18090, 'notificaciones-nexus', '2026-07-14 18:13:33.926826+00', 281),
	(282, 18090, 'notificaciones-nexus', '2026-07-14 18:13:43.256183+00', 282),
	(283, 18090, 'notificaciones-nexus', '2026-07-14 18:13:55.036287+00', 283),
	(284, 18090, 'notificaciones-nexus', '2026-07-14 18:13:55.036287+00', 284),
	(285, 18090, 'notificaciones-nexus', '2026-07-14 18:13:55.036287+00', 285),
	(286, 18090, 'notificaciones-nexus', '2026-07-14 18:13:55.036287+00', 286),
	(287, 17638, 'notificacion-nueva-solicitud', '2026-07-14 18:56:43.630205+00', 287),
	(288, 18090, 'notificaciones-nexus', '2026-07-14 19:07:13.123971+00', 288),
	(289, 18090, 'notificaciones-nexus', '2026-07-14 19:07:13.123971+00', 289),
	(290, 18090, 'notificaciones-nexus', '2026-07-14 19:07:13.123971+00', 290),
	(291, 18090, 'notificaciones-nexus', '2026-07-14 19:07:13.123971+00', 291),
	(292, 18090, 'notificaciones-nexus', '2026-07-14 19:13:13.920598+00', 292),
	(293, 18090, 'notificaciones-nexus', '2026-07-14 19:13:52.404712+00', 293),
	(294, 18090, 'notificaciones-nexus', '2026-07-14 19:14:49.647133+00', 294),
	(295, 18090, 'notificaciones-nexus', '2026-07-14 23:12:32.146651+00', 295),
	(296, 17638, 'notificacion-nueva-solicitud', '2026-07-14 23:32:33.489455+00', 296),
	(297, 17638, 'notificacion-nueva-solicitud', '2026-07-14 23:34:51.782626+00', 297),
	(298, 17638, 'notificacion-nueva-solicitud', '2026-07-14 23:42:01.775909+00', 298),
	(299, 17638, 'notificacion-nueva-solicitud', '2026-07-14 23:46:18.760743+00', 299),
	(300, 17638, 'notificacion-nueva-solicitud', '2026-07-14 23:51:39.794155+00', 300),
	(301, 17638, 'notificacion-nueva-solicitud', '2026-07-14 23:56:40.542502+00', 301),
	(302, 18090, 'notificaciones-nexus', '2026-07-15 00:28:18.207416+00', 302),
	(303, 18090, 'notificaciones-nexus', '2026-07-15 00:28:18.66968+00', 303),
	(304, 18090, 'notificaciones-nexus', '2026-07-15 00:28:45.904212+00', 304),
	(305, 18090, 'notificaciones-nexus', '2026-07-15 00:28:46.235312+00', 305),
	(306, 18090, 'notificaciones-nexus', '2026-07-15 00:31:15.726877+00', 306),
	(307, 18090, 'notificaciones-nexus', '2026-07-15 00:31:16.214386+00', 307),
	(308, 18090, 'notificaciones-nexus', '2026-07-15 01:06:37.165064+00', 308),
	(309, 18090, 'notificaciones-nexus', '2026-07-15 01:06:37.556934+00', 309),
	(310, 18090, 'notificaciones-nexus', '2026-07-15 01:07:33.827901+00', 310),
	(311, 18090, 'notificaciones-nexus', '2026-07-15 01:07:34.243327+00', 311),
	(312, 17638, 'notificacion-nueva-solicitud', '2026-07-15 16:38:28.512001+00', 312),
	(313, 18090, 'notificaciones-nexus', '2026-07-15 16:46:12.050966+00', 313),
	(314, 18090, 'notificaciones-nexus', '2026-07-15 16:46:12.817147+00', 314),
	(315, 18090, 'notificaciones-nexus', '2026-07-15 16:47:24.265914+00', 315),
	(316, 18090, 'notificaciones-nexus', '2026-07-15 16:47:24.634339+00', 316),
	(317, 17638, 'notificacion-nueva-solicitud', '2026-07-15 17:05:15.468454+00', 317),
	(318, 18090, 'notificaciones-nexus', '2026-07-15 17:05:46.791019+00', 318),
	(319, 17638, 'notificacion-nueva-solicitud', '2026-07-15 17:06:58.389328+00', 319),
	(320, 18090, 'notificaciones-nexus', '2026-07-15 17:07:28.964762+00', 320),
	(321, 18090, 'notificaciones-nexus', '2026-07-15 17:07:43.120708+00', 321),
	(322, 17638, 'notificacion-nueva-solicitud', '2026-07-15 17:29:47.278992+00', 322),
	(323, 18090, 'notificaciones-nexus', '2026-07-15 17:51:14.298215+00', 323),
	(324, 18090, 'notificaciones-nexus', '2026-07-15 18:05:34.165257+00', 324),
	(325, 18090, 'notificaciones-nexus', '2026-07-15 18:05:34.426626+00', 325),
	(326, 18090, 'notificaciones-nexus', '2026-07-15 18:05:34.674184+00', 326),
	(327, 18090, 'notificaciones-nexus', '2026-07-15 18:05:34.915113+00', 327),
	(328, 17638, 'notificacion-nueva-solicitud', '2026-07-15 18:45:51.433345+00', 328),
	(329, 18090, 'notificaciones-nexus', '2026-07-15 19:06:42.824749+00', 329),
	(330, 18090, 'notificaciones-nexus', '2026-07-15 19:06:55.30775+00', 330),
	(331, 17638, 'notificacion-nueva-solicitud', '2026-07-15 19:12:02.700832+00', 331),
	(332, 17638, 'notificacion-nueva-solicitud', '2026-07-15 19:16:29.869273+00', 332),
	(333, 17638, 'notificacion-nueva-solicitud', '2026-07-15 19:19:38.856924+00', 333),
	(334, 18090, 'notificaciones-nexus', '2026-07-15 19:21:26.427629+00', 334),
	(335, 18090, 'notificaciones-nexus', '2026-07-15 19:21:29.273775+00', 335),
	(336, 18090, 'notificaciones-nexus', '2026-07-15 19:23:15.370821+00', 336),
	(337, 17638, 'notificacion-nueva-solicitud', '2026-07-15 19:44:04.307593+00', 337),
	(338, 18090, 'notificaciones-nexus', '2026-07-15 19:45:26.591946+00', 338),
	(339, 18090, 'notificaciones-nexus', '2026-07-15 19:45:46.290438+00', 339),
	(340, 17638, 'notificacion-nueva-solicitud', '2026-07-15 19:46:43.159108+00', 340),
	(341, 18090, 'notificaciones-nexus', '2026-07-15 19:49:31.803166+00', 341),
	(342, 18090, 'notificaciones-nexus', '2026-07-15 19:49:32.093558+00', 342),
	(343, 17638, 'notificacion-nueva-solicitud', '2026-07-15 19:49:39.140984+00', 343),
	(344, 17638, 'notificacion-nueva-solicitud', '2026-07-15 19:51:27.785903+00', 344),
	(345, 18090, 'notificaciones-nexus', '2026-07-15 19:54:22.538442+00', 345),
	(346, 18090, 'notificaciones-nexus', '2026-07-15 19:54:27.230739+00', 346),
	(347, 18090, 'notificaciones-nexus', '2026-07-15 19:56:27.126524+00', 347),
	(348, 18090, 'notificaciones-nexus', '2026-07-15 19:56:27.480545+00', 348),
	(349, 18090, 'notificaciones-nexus', '2026-07-15 20:05:36.945653+00', 349),
	(350, 18090, 'notificaciones-nexus', '2026-07-15 20:05:37.265598+00', 350),
	(351, 18090, 'notificaciones-nexus', '2026-07-15 20:05:37.58922+00', 351),
	(352, 18090, 'notificaciones-nexus', '2026-07-15 20:06:21.035373+00', 352),
	(353, 17638, 'notificacion-nueva-solicitud', '2026-07-15 20:26:40.834042+00', 353),
	(354, 18090, 'notificaciones-nexus', '2026-07-15 20:29:28.979826+00', 354),
	(355, 18090, 'notificaciones-nexus', '2026-07-15 20:29:29.430922+00', 355),
	(356, 18090, 'notificaciones-nexus', '2026-07-15 20:42:21.121678+00', 356),
	(357, 18090, 'notificaciones-nexus', '2026-07-15 20:42:21.626987+00', 357),
	(358, 18090, 'notificaciones-nexus', '2026-07-15 20:42:21.888489+00', 358),
	(359, 18090, 'notificaciones-nexus', '2026-07-15 20:43:55.822538+00', 359),
	(360, 17638, 'notificacion-nueva-solicitud', '2026-07-15 20:48:17.81329+00', 360),
	(361, 18090, 'notificaciones-nexus', '2026-07-15 20:49:30.884756+00', 361),
	(362, 18090, 'notificaciones-nexus', '2026-07-15 20:49:31.138999+00', 362),
	(363, 18090, 'notificaciones-nexus', '2026-07-15 20:49:31.362329+00', 363),
	(364, 17638, 'notificacion-nueva-solicitud', '2026-07-15 20:52:59.194939+00', 364),
	(365, 17638, 'notificacion-nueva-solicitud', '2026-07-15 21:05:15.455978+00', 365),
	(366, 18090, 'notificaciones-nexus', '2026-07-15 21:05:46.298151+00', 366),
	(367, 18090, 'notificaciones-nexus', '2026-07-15 21:18:44.315993+00', 367),
	(368, 18090, 'notificaciones-nexus', '2026-07-15 21:18:44.597466+00', 368),
	(369, 17638, 'notificacion-nueva-solicitud', '2026-07-15 22:52:12.678163+00', 369),
	(370, 18090, 'notificaciones-nexus', '2026-07-15 22:54:29.772805+00', 370),
	(371, 18090, 'notificaciones-nexus', '2026-07-15 22:56:29.345541+00', 371),
	(372, 18090, 'notificaciones-nexus', '2026-07-15 22:57:39.744447+00', 372),
	(373, 18090, 'notificaciones-nexus', '2026-07-15 23:03:48.567949+00', 373),
	(374, 18090, 'notificaciones-nexus', '2026-07-15 23:16:03.792671+00', 374),
	(375, 18090, 'notificaciones-nexus', '2026-07-15 23:17:57.627367+00', 375),
	(376, 18090, 'notificaciones-nexus', '2026-07-15 23:24:54.824825+00', 376),
	(377, 18090, 'notificaciones-nexus', '2026-07-15 23:25:08.050084+00', 377),
	(378, 17638, 'notificacion-nueva-solicitud', '2026-07-15 23:29:35.560771+00', 378),
	(379, 18090, 'notificaciones-nexus', '2026-07-15 23:33:12.750939+00', 379),
	(380, 18090, 'notificaciones-nexus', '2026-07-15 23:33:33.873091+00', 380),
	(381, 18090, 'notificaciones-nexus', '2026-07-15 23:36:37.379281+00', 381),
	(382, 18090, 'notificaciones-nexus', '2026-07-15 23:53:24.139109+00', 382),
	(383, 18090, 'notificaciones-nexus', '2026-07-15 23:56:05.326974+00', 383),
	(384, 18090, 'notificaciones-nexus', '2026-07-15 23:56:18.624868+00', 384),
	(385, 17638, 'notificacion-nueva-solicitud', '2026-07-16 00:07:37.086919+00', 385),
	(386, 18090, 'notificaciones-nexus', '2026-07-16 00:08:32.502023+00', 386),
	(387, 18090, 'notificaciones-nexus', '2026-07-16 00:08:45.355588+00', 387),
	(388, 18090, 'notificaciones-nexus', '2026-07-16 00:09:19.956641+00', 388),
	(389, 18090, 'notificaciones-nexus', '2026-07-16 00:09:26.098331+00', 389),
	(390, 18090, 'notificaciones-nexus', '2026-07-16 00:09:35.466224+00', 390),
	(391, 18090, 'notificaciones-nexus', '2026-07-16 00:09:39.074795+00', 391),
	(392, 17638, 'notificacion-nueva-solicitud', '2026-07-16 00:13:18.558604+00', 392),
	(393, 18090, 'notificaciones-nexus', '2026-07-16 00:13:55.371693+00', 393),
	(394, 18090, 'notificaciones-nexus', '2026-07-16 00:14:54.049027+00', 394),
	(395, 18090, 'notificaciones-nexus', '2026-07-16 00:15:18.188267+00', 395),
	(396, 18090, 'notificaciones-nexus', '2026-07-16 00:15:41.702906+00', 396),
	(397, 18090, 'notificaciones-nexus', '2026-07-16 00:15:51.301593+00', 397),
	(398, 18090, 'notificaciones-nexus', '2026-07-16 00:16:02.353463+00', 398),
	(399, 18090, 'notificaciones-nexus', '2026-07-16 00:16:49.471536+00', 399),
	(400, 18090, 'notificaciones-nexus', '2026-07-16 00:16:58.492524+00', 400),
	(401, 18090, 'notificaciones-nexus', '2026-07-16 00:17:06.423784+00', 401),
	(402, 18090, 'notificaciones-nexus', '2026-07-16 00:17:30.883316+00', 402),
	(403, 18090, 'notificaciones-nexus', '2026-07-16 00:17:31.146652+00', 403),
	(404, 18090, 'notificaciones-nexus', '2026-07-16 00:18:08.591908+00', 404),
	(405, 18090, 'notificaciones-nexus', '2026-07-16 00:18:22.306616+00', 405),
	(406, 18090, 'notificaciones-nexus', '2026-07-16 00:18:28.315994+00', 406),
	(407, 18090, 'notificaciones-nexus', '2026-07-16 00:21:58.279324+00', 407),
	(408, 18090, 'notificaciones-nexus', '2026-07-16 00:22:14.425192+00', 408),
	(409, 18090, 'notificaciones-nexus', '2026-07-16 00:22:19.377197+00', 409),
	(410, 18090, 'notificaciones-nexus', '2026-07-16 00:22:37.338744+00', 410),
	(411, 18090, 'notificaciones-nexus', '2026-07-16 00:25:00.845518+00', 411),
	(412, 18090, 'notificaciones-nexus', '2026-07-16 00:26:18.833637+00', 412),
	(413, 18090, 'notificaciones-nexus', '2026-07-16 00:26:28.519972+00', 413),
	(414, 18090, 'notificaciones-nexus', '2026-07-16 00:32:26.172374+00', 414),
	(415, 18090, 'notificaciones-nexus', '2026-07-16 00:32:39.131051+00', 415),
	(416, 18090, 'notificaciones-nexus', '2026-07-16 00:33:11.851257+00', 416),
	(417, 18090, 'notificaciones-nexus', '2026-07-16 00:33:23.627486+00', 417),
	(418, 18090, 'notificaciones-nexus', '2026-07-16 00:34:57.38308+00', 418),
	(419, 18090, 'notificaciones-nexus', '2026-07-16 00:35:47.920091+00', 419),
	(420, 18090, 'notificaciones-nexus', '2026-07-16 00:35:48.256885+00', 420),
	(421, 18090, 'notificaciones-nexus', '2026-07-16 00:58:08.834001+00', 421),
	(422, 18090, 'notificaciones-nexus', '2026-07-16 00:58:23.183419+00', 422),
	(423, 18090, 'notificaciones-nexus', '2026-07-16 00:58:23.438338+00', 423),
	(424, 18090, 'notificaciones-nexus', '2026-07-16 00:58:23.666285+00', 424),
	(425, 18090, 'notificaciones-nexus', '2026-07-16 00:59:27.523602+00', 425),
	(426, 18090, 'notificaciones-nexus', '2026-07-16 01:01:24.058837+00', 426),
	(427, 18090, 'notificaciones-nexus', '2026-07-16 01:01:24.576345+00', 427),
	(428, 18090, 'notificaciones-nexus', '2026-07-16 01:01:53.240179+00', 428),
	(429, 18090, 'notificaciones-nexus', '2026-07-16 01:01:53.580466+00', 429),
	(430, 18090, 'notificaciones-nexus', '2026-07-16 01:04:18.611626+00', 430),
	(431, 18090, 'notificaciones-nexus', '2026-07-16 01:08:02.036798+00', 431),
	(432, 18090, 'notificaciones-nexus', '2026-07-16 01:08:46.732579+00', 432),
	(433, 18090, 'notificaciones-nexus', '2026-07-16 01:08:51.465184+00', 433),
	(434, 18090, 'notificaciones-nexus', '2026-07-16 01:10:40.235309+00', 434),
	(435, 18090, 'notificaciones-nexus', '2026-07-16 01:10:45.490439+00', 435),
	(436, 18090, 'notificaciones-nexus', '2026-07-16 01:10:45.893241+00', 436),
	(437, 18090, 'notificaciones-nexus', '2026-07-16 01:10:54.53014+00', 437),
	(438, 18090, 'notificaciones-nexus', '2026-07-16 01:10:56.780811+00', 438),
	(439, 18090, 'notificaciones-nexus', '2026-07-16 01:12:21.380527+00', 439),
	(440, 18090, 'notificaciones-nexus', '2026-07-16 01:12:21.664226+00', 440),
	(441, 18090, 'notificaciones-nexus', '2026-07-16 01:12:21.915956+00', 441),
	(442, 17638, 'notificacion-nueva-solicitud', '2026-07-16 01:22:06.53022+00', 442),
	(443, 18090, 'notificaciones-nexus', '2026-07-16 01:24:34.277661+00', 443),
	(444, 18090, 'notificaciones-nexus', '2026-07-16 01:24:50.7663+00', 444),
	(445, 18090, 'notificaciones-nexus', '2026-07-16 02:17:35.630396+00', 445),
	(446, 18090, 'notificaciones-nexus', '2026-07-16 02:18:14.526126+00', 446),
	(447, 18090, 'notificaciones-nexus', '2026-07-16 02:18:14.828562+00', 447),
	(448, 18090, 'notificaciones-nexus', '2026-07-16 02:18:15.099405+00', 448),
	(449, 18090, 'notificaciones-nexus', '2026-07-16 16:15:46.248819+00', 449),
	(450, 18090, 'notificaciones-nexus', '2026-07-16 16:15:46.797143+00', 450),
	(451, 18090, 'notificaciones-nexus', '2026-07-16 16:16:29.473511+00', 451),
	(452, 18090, 'notificaciones-nexus', '2026-07-16 16:16:32.597894+00', 452),
	(453, 18090, 'notificaciones-nexus', '2026-07-16 16:16:32.962732+00', 453),
	(454, 18090, 'notificaciones-nexus', '2026-07-16 16:16:48.87984+00', 454),
	(455, 18090, 'notificaciones-nexus', '2026-07-16 16:16:51.211321+00', 455),
	(456, 18090, 'notificaciones-nexus', '2026-07-16 16:16:57.355011+00', 456),
	(457, 18090, 'notificaciones-nexus', '2026-07-16 17:21:49.35897+00', 457),
	(458, 18090, 'notificaciones-nexus', '2026-07-16 17:21:50.084788+00', 458),
	(459, 18090, 'notificaciones-nexus', '2026-07-16 17:22:51.041854+00', 459),
	(460, 18090, 'notificaciones-nexus', '2026-07-16 17:22:51.436528+00', 460),
	(461, 18090, 'notificaciones-nexus', '2026-07-16 17:22:51.717123+00', 461),
	(462, 18090, 'notificaciones-nexus', '2026-07-16 17:23:16.945441+00', 462),
	(463, 18090, 'notificaciones-nexus', '2026-07-16 17:23:23.375808+00', 463),
	(464, 18090, 'notificaciones-nexus', '2026-07-16 17:23:23.717166+00', 464),
	(465, 18090, 'notificaciones-nexus', '2026-07-16 17:23:23.931951+00', 465),
	(466, 18090, 'notificaciones-nexus', '2026-07-16 17:23:34.812235+00', 466),
	(467, 18090, 'notificaciones-nexus', '2026-07-16 17:23:41.522319+00', 467),
	(468, 18090, 'notificaciones-nexus', '2026-07-16 17:33:21.035975+00', 468),
	(469, 17638, 'notificacion-nueva-solicitud', '2026-07-16 17:34:12.612489+00', 469),
	(470, 18090, 'notificaciones-nexus', '2026-07-16 17:40:52.653071+00', 470),
	(471, 18090, 'notificaciones-nexus', '2026-07-16 17:40:52.95744+00', 471),
	(472, 18090, 'notificaciones-nexus', '2026-07-16 17:41:08.96973+00', 472),
	(473, 18090, 'notificaciones-nexus', '2026-07-16 17:41:09.211837+00', 473),
	(474, 18090, 'notificaciones-nexus', '2026-07-16 17:41:09.505215+00', 474),
	(475, 18090, 'notificaciones-nexus', '2026-07-16 17:58:42.553988+00', 475),
	(476, 18090, 'notificaciones-nexus', '2026-07-16 17:58:42.876874+00', 476),
	(477, 18090, 'notificaciones-nexus', '2026-07-16 17:58:43.124158+00', 477),
	(478, 18090, 'notificaciones-nexus', '2026-07-16 18:23:33.128656+00', 478),
	(479, 18090, 'notificaciones-nexus', '2026-07-16 18:23:33.465726+00', 479),
	(480, 17638, 'notificacion-nueva-solicitud', '2026-07-16 19:00:44.828276+00', 480),
	(481, 17638, 'notificacion-nueva-solicitud', '2026-07-16 19:37:42.204499+00', 481),
	(482, 18090, 'notificaciones-nexus', '2026-07-16 19:39:46.501315+00', 482),
	(483, 18090, 'notificaciones-nexus', '2026-07-16 19:39:46.990632+00', 483),
	(484, 18090, 'notificaciones-nexus', '2026-07-16 19:53:34.973321+00', 484),
	(485, 18090, 'notificaciones-nexus', '2026-07-16 19:53:35.392295+00', 485),
	(486, 17638, 'notificacion-nueva-solicitud', '2026-07-16 20:00:49.118252+00', 486),
	(487, 17638, 'notificacion-nueva-solicitud', '2026-07-16 20:03:54.892445+00', 487),
	(488, 18090, 'notificaciones-nexus', '2026-07-16 20:04:35.376316+00', 488),
	(489, 18090, 'notificaciones-nexus', '2026-07-16 20:04:39.151712+00', 489),
	(490, 18090, 'notificaciones-nexus', '2026-07-16 20:04:42.166333+00', 490),
	(491, 18090, 'notificaciones-nexus', '2026-07-16 20:04:49.916529+00', 491),
	(492, 18090, 'notificaciones-nexus', '2026-07-16 20:07:52.954404+00', 492),
	(497, 18090, 'notificaciones-nexus', '2026-07-16 20:22:39.557381+00', 497),
	(498, 18090, 'notificaciones-nexus', '2026-07-16 20:22:39.964241+00', 498),
	(499, 18090, 'notificaciones-nexus', '2026-07-16 20:25:26.343045+00', 499),
	(500, 18090, 'notificaciones-nexus', '2026-07-16 20:25:26.343045+00', 500),
	(501, 18090, 'notificaciones-nexus', '2026-07-16 20:25:26.343045+00', 501),
	(502, 18090, 'notificaciones-nexus', '2026-07-16 20:25:26.343045+00', 502),
	(503, 18090, 'notificaciones-nexus', '2026-07-16 20:26:48.727207+00', 503),
	(504, 18090, 'notificaciones-nexus', '2026-07-16 20:31:44.397+00', 504),
	(505, 18090, 'notificaciones-nexus', '2026-07-16 20:33:31.424328+00', 505),
	(506, 17638, 'notificacion-nueva-solicitud', '2026-07-16 20:45:37.349182+00', 506),
	(507, 17638, 'notificacion-nueva-solicitud', '2026-07-16 20:46:22.985632+00', 507),
	(508, 18090, 'notificaciones-nexus', '2026-07-16 20:48:55.803216+00', 508),
	(509, 18090, 'notificaciones-nexus', '2026-07-16 20:48:56.216917+00', 509),
	(510, 17638, 'notificacion-nueva-solicitud', '2026-07-16 20:50:36.147529+00', 510),
	(511, 18090, 'notificaciones-nexus', '2026-07-16 20:59:50.724812+00', 511),
	(512, 18090, 'notificaciones-nexus', '2026-07-16 21:00:00.270387+00', 512),
	(513, 18090, 'notificaciones-nexus', '2026-07-16 21:00:00.687295+00', 513),
	(514, 18090, 'notificaciones-nexus', '2026-07-16 21:02:18.660508+00', 514),
	(515, 17638, 'notificacion-nueva-solicitud', '2026-07-16 23:02:09.894431+00', 515),
	(516, 18090, 'notificaciones-nexus', '2026-07-16 23:12:50.443324+00', 516),
	(517, 18090, 'notificaciones-nexus', '2026-07-16 23:13:01.124071+00', 517),
	(518, 18090, 'notificaciones-nexus', '2026-07-16 23:16:19.536661+00', 518),
	(519, 18090, 'notificaciones-nexus', '2026-07-16 23:18:05.327758+00', 519),
	(520, 18090, 'notificaciones-nexus', '2026-07-16 23:18:16.043838+00', 520),
	(521, 18090, 'notificaciones-nexus', '2026-07-16 23:18:16.455295+00', 521),
	(522, 17638, 'notificacion-nueva-solicitud', '2026-07-16 23:27:36.837549+00', 522),
	(523, 17638, 'notificacion-nueva-solicitud', '2026-07-16 23:42:36.682551+00', 523),
	(524, 18090, 'notificaciones-nexus', '2026-07-16 23:58:24.735446+00', 524),
	(525, 18090, 'notificaciones-nexus', '2026-07-17 00:00:59.731194+00', 525),
	(526, 18090, 'notificaciones-nexus', '2026-07-17 00:15:48.572167+00', 526),
	(527, 18090, 'notificaciones-nexus', '2026-07-17 00:26:32.929495+00', 527),
	(528, 18090, 'notificaciones-nexus', '2026-07-17 00:34:11.012246+00', 528),
	(529, 18090, 'notificaciones-nexus', '2026-07-17 00:34:11.630205+00', 529),
	(530, 18090, 'notificaciones-nexus', '2026-07-17 00:34:12.271558+00', 530),
	(531, 18090, 'notificaciones-nexus', '2026-07-17 00:59:55.338172+00', 531),
	(532, 18090, 'notificaciones-nexus', '2026-07-17 00:59:55.617851+00', 532),
	(533, 18090, 'notificaciones-nexus', '2026-07-17 16:07:40.615497+00', 533),
	(534, 18090, 'notificaciones-nexus', '2026-07-17 16:07:41.195673+00', 534),
	(535, 18090, 'notificaciones-nexus', '2026-07-17 16:25:14.379485+00', 535),
	(536, 18090, 'notificaciones-nexus', '2026-07-17 16:25:14.865693+00', 536),
	(537, 18090, 'notificaciones-nexus', '2026-07-17 16:28:53.234983+00', 537),
	(538, 18090, 'notificaciones-nexus', '2026-07-17 16:29:07.782647+00', 538),
	(539, 17638, 'notificacion-nueva-solicitud', '2026-07-17 18:35:15.623182+00', 539),
	(540, 18090, 'notificaciones-nexus', '2026-07-17 20:08:46.679591+00', 540),
	(541, 18090, 'notificaciones-nexus', '2026-07-17 20:08:51.852661+00', 541),
	(542, 18090, 'notificaciones-nexus', '2026-07-17 20:08:55.751836+00', 542),
	(543, 18090, 'notificaciones-nexus', '2026-07-17 20:08:55.751836+00', 543),
	(544, 18090, 'notificaciones-nexus', '2026-07-17 20:23:00.80702+00', 544),
	(545, 18090, 'notificaciones-nexus', '2026-07-17 20:23:00.80702+00', 545),
	(546, 18090, 'notificaciones-nexus', '2026-07-17 20:24:31.947013+00', 546),
	(547, 18090, 'notificaciones-nexus', '2026-07-17 20:24:34.617581+00', 547),
	(548, 18090, 'notificaciones-nexus', '2026-07-17 20:24:38.866643+00', 548),
	(549, 18090, 'notificaciones-nexus', '2026-07-17 20:25:12.81911+00', 549),
	(550, 18090, 'notificaciones-nexus', '2026-07-17 20:25:20.186882+00', 550),
	(551, 18090, 'notificaciones-nexus', '2026-07-17 20:25:20.710655+00', 551),
	(552, 18090, 'notificaciones-nexus', '2026-07-17 20:27:41.528632+00', 552),
	(553, 18090, 'notificaciones-nexus', '2026-07-17 20:29:14.597396+00', 553),
	(554, 18090, 'notificaciones-nexus', '2026-07-17 20:29:14.597396+00', 554),
	(555, 18090, 'notificaciones-nexus', '2026-07-20 15:33:39.504488+00', 555),
	(556, 18090, 'notificaciones-nexus', '2026-07-20 15:34:01.617906+00', 556),
	(557, 18090, 'notificaciones-nexus', '2026-07-20 15:34:18.910849+00', 557);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 881, true);


--
-- Name: file_extensions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."file_extensions_id_seq"', 26, true);


--
-- Name: internal_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."internal_roles_id_seq"', 5, true);


--
-- Name: priorities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."priorities_id_seq"', 3, true);


--
-- Name: request_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."request_categories_id_seq"', 18, true);


--
-- Name: specialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."specialties_id_seq"', 9, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 557, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Ye0nbigEboydSE1OhQI1tbmzzJlbcTDhWiJJ0vLNbFc1So8HVORQyYelYz0TKNm

RESET ALL;
