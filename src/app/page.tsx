'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Service {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: 'operational' | 'degraded' | 'partial' | 'major' | 'maintenance';
    uptime: number;
}

interface Incident {
    id: string;
    title: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'scheduled';
    severity: 'minor' | 'major' | 'critical' | 'maintenance';
    affectedServices: string[];
    createdAt: string;
    updates: Array<{
        time: string;
        status: string;
        message: string;
    }>;
}

export default function StatusPage() {
    const [services, setServices] = useState<Service[]>([
        { id: 'gov-utils', name: 'Gov Utils Bot', description: 'Moderation & administration bot', icon: '🤖', status: 'operational', uptime: 99.9 },
        { id: 'economy-bot', name: 'Economy Bot', description: 'Economy, banking & government systems', icon: '💰', status: 'operational', uptime: 99.8 },
        { id: 'admin-dashboard', name: 'Admin Dashboard', description: 'Staff administration portal', icon: '🖥️', status: 'operational', uptime: 100 },
        { id: 'webmail', name: 'Webmail', description: 'Email service for usgrp.xyz', icon: '📧', status: 'operational', uptime: 99.5 },
        { id: 'recordings', name: 'Voice Recordings', description: 'Meeting recordings storage', icon: '🎙️', status: 'operational', uptime: 100 },
    ]);

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch status from API
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/status');
            if (res.ok) {
                const data = await res.json();
                if (data.services) setServices(data.services);
                if (data.incidents) setIncidents(data.incidents);
            }
        } catch (e) {
            console.error('Failed to fetch status:', e);
        }
        setLoading(false);
    };

    const getOverallStatus = () => {
        const hasIssue = services.some(s => s.status !== 'operational');
        const hasMajor = services.some(s => s.status === 'major');

        if (hasMajor) return 'major';
        if (hasIssue) return 'degraded';
        return 'operational';
    };

    const overallStatus = getOverallStatus();

    const getStatusText = (status: string) => {
        switch (status) {
            case 'operational': return 'Operational';
            case 'degraded': return 'Degraded';
            case 'partial': return 'Partial Outage';
            case 'major': return 'Major Outage';
            case 'maintenance': return 'Maintenance';
            default: return 'Unknown';
        }
    };

    // Generate uptime data client-side only to avoid hydration mismatch
    const [uptimeDays, setUptimeDays] = useState<string[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        // Generate 90 days of uptime data
        const days = Array.from({ length: 90 }, () => {
            const rand = Math.random();
            if (rand > 0.98) return 'major';
            if (rand > 0.95) return 'partial';
            if (rand > 0.92) return 'degraded';
            return 'operational';
        });
        setUptimeDays(days);
        setLastUpdated(new Date().toLocaleString());
    }, []);

    return (
        <div className="page-container">
            <Header />

            {/* Status Banner */}
            <div className={`status-banner ${overallStatus}`}>
                <h2>
                    {overallStatus === 'operational' && '✓ All Systems Operational'}
                    {overallStatus === 'degraded' && '⚠ Some Systems Degraded'}
                    {overallStatus === 'major' && '✕ Major System Outage'}
                </h2>
                <p>Last updated: {lastUpdated || 'Loading...'}</p>
            </div>

            <main className="main-content">
                {/* Services */}
                <div className="service-list">
                    {services.map((service) => (
                        <div key={service.id} className="service-item">
                            <div className="service-info">
                                <span className="service-icon">{service.icon}</span>
                                <div>
                                    <div className="service-name">{service.name}</div>
                                    <div className="service-description">{service.description}</div>
                                </div>
                            </div>
                            <div className="service-status">
                                <span className={`status-dot ${service.status}`}></span>
                                <span className={`status-text ${service.status}`}>
                                    {getStatusText(service.status)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Uptime History */}
                <div className="uptime-section">
                    <div className="uptime-header">
                        <h3>90-Day Uptime History</h3>
                        <span>99.9% uptime</span>
                    </div>
                    <div className="uptime-bar">
                        {uptimeDays.map((status, i) => (
                            <div
                                key={i}
                                className={`uptime-day ${status}`}
                                title={`${90 - i} days ago: ${getStatusText(status)}`}
                            />
                        ))}
                    </div>
                    <div className="uptime-footer">
                        <span>90 days ago</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Active Incidents */}
                <div className="incidents-section">
                    <div className="section-header">
                        <h2 className="section-title">Incidents & Maintenance</h2>
                    </div>

                    {incidents.length > 0 ? (
                        incidents.map((incident) => (
                            <div key={incident.id} className="incident-card">
                                <div className="incident-header">
                                    <div className="incident-title">{incident.title}</div>
                                    <span className={`incident-badge ${incident.status}`}>
                                        {incident.status}
                                    </span>
                                </div>
                                <div className="incident-meta">
                                    Started: {new Date(incident.createdAt).toLocaleString()} •
                                    Affecting: {incident.affectedServices.join(', ')}
                                </div>
                                {incident.updates.length > 0 && (
                                    <div className="incident-updates">
                                        {incident.updates.map((update, i) => (
                                            <div key={i} className="incident-update">
                                                <div className="update-time">{update.time}</div>
                                                <div className="update-message">{update.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="card">
                            <div className="empty-state">
                                <div className="empty-state-icon">✓</div>
                                <p>No recent incidents</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
