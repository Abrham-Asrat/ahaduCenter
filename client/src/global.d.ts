declare module '*.css';

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

declare module 'jwt-decode';

export {};

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
					renderButton: (element: Element, options: { theme: string; size: string; width: number; text: string }) => void;
				};
			};
		};
	}

	interface GoogleCredentialResponse {
		credential: string;
	}

	interface HTMLScriptElement {
		readyState?: string;
	}
}
