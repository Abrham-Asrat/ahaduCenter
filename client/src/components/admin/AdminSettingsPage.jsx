// src/pages/admin/AdminSettingsPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminSettingsPage Component
 * 
 * Allows admins to configure platform settings.
 * 
 * Features:
 * - Tabs: General, Payment, Notifications, Integrations, Security
 * - General: site info, localization, branding, business hours
 * - Payment: payment methods, tax & fees, order settings
 * - Notifications: email and platform toggles
 * - Integrations: third-party API settings
 * - Security: password policy, login security, backup
 * 
 * State:
 * - activeTab: Currently selected tab
 * - settings: Object with all settings data
 */
const AdminSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('General');
    const [settings, setSettings] = useState({
        siteName: 'Ahadu Center',
        tagline: 'Premium Digital Terminal',
        siteUrl: 'https://admin.ahaducenter.com',
        contactEmail: 'support@ahaducenter.com',
        phone: '+251 911 234 567',
        address: 'Bole Medhanialem, Addis Ababa, Ethiopia',
        currency: 'ETB',
        language: 'English',
        // Payment
        codEnabled: true,
        bankTransferEnabled: true,
        bankDetails: 'CBE - 1000123456789',
        cardEnabled: false,
        mobileMoneyEnabled: true,
        mobileNumber: '+251 911 234 567',
        taxRate: 15,
        includeTax: false,
        autoFulfill: true,
        // Security
        minPasswordLength: '12',
        requireUppercase: true,
        requireNumbers: true,
        requireSpecial: true,
        twoFactor: true,
        sessionTimeout: '30 Minutes',
        maxAttempts: '5',
    });

    // Update settings helper
    const updateSetting = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const tabs = ['General', 'Payment', 'Notifications', 'Integrations', 'Security'];

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Settings</h2>
                    <p className="text-lg text-on-surface-variant">Configure platform-wide preferences and integrations.</p>
                </div>
                <button className="bg-primary text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                    <span className="material-symbols-outlined text-lg">save</span>
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar border-b border-white/10 mb-8 gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab
                                ? 'text-primary border-b-2 border-primary font-semibold bg-primary/5'
                                : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'General' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main column */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Site Information */}
                        <div className="glass-panel rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <h3 className="text-xl font-bold text-white">Site Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Site Name</label>
                                    <input type="text" value={settings.siteName} onChange={(e) => updateSetting('siteName', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Tagline</label>
                                    <input type="text" value={settings.tagline} onChange={(e) => updateSetting('tagline', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Site URL</label>
                                    <input type="url" value={settings.siteUrl} onChange={(e) => updateSetting('siteUrl', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white/70 focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Contact Email</label>
                                    <input type="email" value={settings.contactEmail} onChange={(e) => updateSetting('contactEmail', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Phone</label>
                                    <input type="tel" value={settings.phone} onChange={(e) => updateSetting('phone', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Physical Address</label>
                                    <textarea value={settings.address} onChange={(e) => updateSetting('address', e.target.value)} rows="3"
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Localization */}
                        <div className="glass-panel rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-secondary">language</span>
                                <h3 className="text-xl font-bold text-white">Localization</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Primary Currency</label>
                                    <select value={settings.currency} onChange={(e) => updateSetting('currency', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                        <option>ETB</option>
                                        <option>USD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Default Language</label>
                                    <select value={settings.language} onChange={(e) => updateSetting('language', e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                        <option>English</option>
                                        <option>Amharic (አማርኛ)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side column */}
                    <div className="space-y-6">
                        {/* Branding */}
                        <div className="glass-panel rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">imagesmode</span>
                                <h3 className="text-xl font-bold text-white">Branding Assets</h3>
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-on-surface-variant mb-3">Primary Logo</label>
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">upload</span>
                                    <p className="text-sm text-on-surface-variant">Drag &amp; drop or click to upload</p>
                                    <p className="text-xs text-on-surface-variant/50 mt-1">SVG, PNG, or JPG (max 2MB)</p>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="glass-panel rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-secondary">schedule</span>
                                <h3 className="text-xl font-bold text-white">Business Hours</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-white">Mon - Fri</span>
                                    <span className="text-on-surface-variant">08:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-white">Saturday</span>
                                    <span className="text-on-surface-variant">09:00 - 13:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-white">Sunday</span>
                                    <span className="px-2 py-1 rounded bg-error/10 text-error text-xs">CLOSED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Payment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Payment methods */}
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">payments</span>
                            Payment Methods
                        </h3>
                        {/* Cash on Delivery */}
                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <p className="text-white font-medium">Cash on Delivery</p>
                                <p className="text-sm text-on-surface-variant">Allow payment upon receiving.</p>
                            </div>
                            <ToggleSwitch checked={settings.codEnabled} onChange={(v) => updateSetting('codEnabled', v)} />
                        </div>
                        {/* Bank Transfer */}
                        <div className="py-3 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Bank Transfer</p>
                                    <p className="text-sm text-on-surface-variant">Direct bank deposits.</p>
                                </div>
                                <ToggleSwitch checked={settings.bankTransferEnabled} onChange={(v) => updateSetting('bankTransferEnabled', v)} />
                            </div>
                            {settings.bankTransferEnabled && (
                                <div className="mt-3 bg-background rounded-lg p-3 border border-white/10">
                                    <label className="text-xs text-on-surface-variant mb-1 block">Account Details</label>
                                    <input type="text" value={settings.bankDetails} onChange={(e) => updateSetting('bankDetails', e.target.value)}
                                        className="w-full bg-transparent text-white text-sm outline-none" />
                                </div>
                            )}
                        </div>
                        {/* Credit Card */}
                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <p className="text-white font-medium">Credit/Debit Card</p>
                                <p className="text-sm text-on-surface-variant">Process via Stripe gateway.</p>
                            </div>
                            <ToggleSwitch checked={settings.cardEnabled} onChange={(v) => updateSetting('cardEnabled', v)} />
                        </div>
                        {/* Mobile Money */}
                        <div className="py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Mobile Money</p>
                                    <p className="text-sm text-on-surface-variant">Telebirr, M-Pesa, etc.</p>
                                </div>
                                <ToggleSwitch checked={settings.mobileMoneyEnabled} onChange={(v) => updateSetting('mobileMoneyEnabled', v)} />
                            </div>
                            {settings.mobileMoneyEnabled && (
                                <div className="mt-3 bg-background rounded-lg p-3 border border-white/10">
                                    <label className="text-xs text-on-surface-variant mb-1 block">Merchant Number</label>
                                    <input type="tel" value={settings.mobileNumber} onChange={(e) => updateSetting('mobileNumber', e.target.value)}
                                        className="w-full bg-transparent text-white text-sm outline-none" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tax & Order Settings */}
                    <div className="space-y-6">
                        <div className="glass-panel rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Tax &amp; Fees</h3>
                            <div className="flex items-center gap-3">
                                <input type="number" value={settings.taxRate} onChange={(e) => updateSetting('taxRate', e.target.value)}
                                    className="w-24 bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" />
                                <span className="text-on-surface-variant">% Tax Rate</span>
                            </div>
                            <div className="flex items-center justify-between mt-4 py-2">
                                <span className="text-white">Prices include tax</span>
                                <ToggleSwitch checked={settings.includeTax} onChange={(v) => updateSetting('includeTax', v)} />
                            </div>
                        </div>
                        <div className="glass-panel rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Order Settings</h3>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-white font-medium">Auto-fulfill Orders</p>
                                    <p className="text-sm text-on-surface-variant">Automatically mark digital goods as fulfilled.</p>
                                </div>
                                <ToggleSwitch checked={settings.autoFulfill} onChange={(v) => updateSetting('autoFulfill', v)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Notifications' && (
                <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <p className="text-white">New Order Alerts</p>
                            <ToggleSwitch checked={true} onChange={() => { }} />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <p className="text-white">Movie Request Alerts</p>
                            <ToggleSwitch checked={true} onChange={() => { }} />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <p className="text-white">New User Registration</p>
                            <ToggleSwitch checked={true} onChange={() => { }} />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <p className="text-white">Borrowing Alerts</p>
                            <ToggleSwitch checked={false} onChange={() => { }} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Integrations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Google Analytics', 'Facebook Pixel', 'Google Maps API', 'SMS Gateway', 'Email Service'].map((integration) => (
                        <div key={integration} className="glass-panel rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{integration}</p>
                                <p className="text-sm text-on-surface-variant">API Key / Config</p>
                            </div>
                            <button className="border border-secondary text-secondary px-4 py-2 rounded-lg hover:bg-secondary/10 transition-all text-sm">
                                Configure
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Security' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Password Policy */}
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">password</span>
                            Password Policy
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Minimum Length</span>
                                <select value={settings.minPasswordLength} onChange={(e) => updateSetting('minPasswordLength', e.target.value)}
                                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                    <option>8 Characters</option>
                                    <option>12 Characters</option>
                                    <option>16 Characters</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-white">Require Uppercase</span>
                                <ToggleSwitch checked={settings.requireUppercase} onChange={(v) => updateSetting('requireUppercase', v)} />
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-white">Require Numbers</span>
                                <ToggleSwitch checked={settings.requireNumbers} onChange={(v) => updateSetting('requireNumbers', v)} />
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-white">Require Special Characters</span>
                                <ToggleSwitch checked={settings.requireSpecial} onChange={(v) => updateSetting('requireSpecial', v)} />
                            </div>
                        </div>
                    </div>

                    {/* Login Security & Backup */}
                    <div className="space-y-6">
                        <div className="glass-panel rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Login Security</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-medium">Two-Factor Authentication</p>
                                        <p className="text-sm text-on-surface-variant">Highly recommended</p>
                                    </div>
                                    <ToggleSwitch checked={settings.twoFactor} onChange={(v) => updateSetting('twoFactor', v)} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">Session Timeout</span>
                                    <select value={settings.sessionTimeout} onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                                        className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                        <option>15 Minutes</option>
                                        <option>30 Minutes</option>
                                        <option>1 Hour</option>
                                    </select>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">Max Login Attempts</span>
                                    <select value={settings.maxAttempts} onChange={(e) => updateSetting('maxAttempts', e.target.value)}
                                        className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                        <option>3 Attempts</option>
                                        <option>5 Attempts</option>
                                        <option>10 Attempts</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Backup &amp; Recovery</h3>
                            <div className="flex gap-4">
                                <button className="flex-1 py-2 border border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Download
                                </button>
                                <button className="flex-1 py-2 border border-white/20 text-on-surface-variant rounded-lg hover:border-white/50 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">restore</span>
                                    Restore
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

/**
 * ToggleSwitch Component (internal reusable)
 */
const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-surface-variant'
                }`}
        >
            <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''
                    }`}
            />
        </button>
    );
};

export default AdminSettingsPage;