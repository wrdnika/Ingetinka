export default {
    sidebar: {
        taskList: 'Task List',
        subscriptions: 'Subscriptions',
        calendar: 'Calendar',
        logout: 'Logout'
    },
    header: {
        dashboard: 'Tasks Dashboard',
        tracker: 'Subscription Tracker',
        settings: 'Settings',
        about: 'About Ingetinka',
        signOut: 'Sign Out',
        language: 'Language'
    },
    login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to continue to your dashboard',
        emailLabel: 'Email Address',
        loading: 'Sending Magic Link...',
        signIn: 'Sign In via Magic Link',
        successTitle: 'Check your email!',
        successMessage: 'We have sent a magic link to {email}. Please check your inbox to sign in.',
        backToLogin: 'Back to Login',
        agreement: 'I agree to the {privacy} and {terms}'
    },
    legal: {
        privacy: {
            title: 'Privacy Policy',
            lastUpdated: 'Last Updated',
            date: 'March 13, 2026',
            intro: 'Welcome to Ingetinka. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.',
            collectionTitle: '2. Data We Collect',
            collectionText: 'Ingetinka requests specific permissions to provide its core functionality:',
            googleAccount: 'Google Account Information: To authenticate your account and persist your settings.',
            calendarData: 'Google Calendar Data: We access your calendar events to display them within the app and sync your tasks or subscriptions automatically.',
            usageTitle: '3. How We Use Your Data',
            usageText: 'Your data is used solely for the following purposes:',
            usageItem1: 'To display and manage your tasks and subscriptions.',
            usageItem2: 'To synchronize your Ingetinka data with your Google Calendar for easier schedule management.',
            usageItem3: 'We do not share, sell, or trade your personal information with third parties.',
            securityTitle: '4. Data Security',
            securityText: 'We implement standard security measures to protect your data. All communication between the app and external services (like Google API and Supabase) is encrypted via SSL/TLS.',
            rightsTitle: '5. Your Rights',
            rightsText: 'You can revoke access to your Google Calendar at any time through your Google Account security settings. You can also delete your data within the application.',
            contactTitle: '6. Contact Us',
            contactText: 'If you have any questions about this Privacy Policy, please contact us at:',
            back: 'Back to App'
        },
        terms: {
            title: 'Terms of Service',
            lastUpdated: 'Last Updated',
            date: 'March 13, 2026',
            acceptanceTitle: '1. Acceptance of Terms',
            acceptanceText: 'By accessing or using Ingetinka, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.',
            descriptionTitle: '2. Description of Service',
            descriptionText: 'Ingetinka is a productivity application that allows users to manage tasks and subscriptions with Google Calendar integration.',
            responsibilitiesTitle: '3. User Responsibilities',
            responsibilitiesText: 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to use the service only for lawful purposes.',
            intellectualTitle: '4. Intellectual Property',
            intellectualText: 'All content, features, and functionality of Ingetinka are and will remain the exclusive property of Ingetinka and its licensors.',
            liabilityTitle: '5. Limitation of Liability',
            liabilityText: 'Ingetinka is provided "as is" without any warranties. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.',
            changesTitle: '6. Changes to Terms',
            changesText: 'We reserve the right to modify these terms at any time. We will notify users of any significant changes by updating the "Last Updated" date.',
            back: 'Back to App'
        }
    },
    subscription: {
        title: 'Subscriptions',
        add: 'Add Subscription',
        edit: 'Edit Subscription',
        total: 'Total',
        month: 'month',
        noActive: 'No active subscriptions found.',
        next: 'Next',
        active: 'Active',
        form: {
            serviceName: 'Service Name',
            price: 'Price (IDR)',
            cycle: 'Billing Cycle',
            category: 'Category',
            firstPayment: 'First Payment',
            notes: 'Notes (Optional)',
            save: 'Save Subscription',
            update: 'Update Subscription',
            selectCategory: 'Select Category',
            addNewCategory: '+ Add New Category'
        }
    },
    common: {
        monthly: 'Monthly',
        yearly: 'Yearly',
        weekly: 'Weekly'
    },
    todo: {
        searchPlaceholder: 'Search tasks...',
        status: 'Status',
        filterAll: 'All',
        filterActive: 'Active',
        filterCompleted: 'Completed',
        sortDeadline: 'Deadline',
        sortPriority: 'Priority',
        sortCreated: 'Created Date',
        header: 'Tasks List',
        noTasks: 'No tasks match your current filters.',
        noTasksSub: 'Try adjusting your search or filter settings, or add a new task!',
        add: 'Add Task',
        create: 'Create',
        form: {
            placeholder: 'What needs to be done?',
            priorityHigh: 'High Priority',
            priorityMedium: 'Medium Priority',
            priorityLow: 'Low Priority',
            categories: 'Categories (comma-separated)',
            notes: 'Notes',
            add: 'Add Task'
        },
        modalTitle: 'Add New Task',
        editTitle: 'Edit Task',
        save: 'Save',
        cancel: 'Cancel'
    }
};
