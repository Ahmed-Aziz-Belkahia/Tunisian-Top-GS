import pandas as pd

# Read the CSV files
participants_df = pd.read_csv('./participants.csv', delimiter=';')
filtered_contacts_df = pd.read_csv('./filtered_contacts.csv')

# Split the 'name' column into 'FirstName' and 'LastName'
participants_df[['FirstName', 'LastName']] = participants_df['name'].str.split(' ', n=1, expand=True)

# Clean and normalize the 'FirstName' and 'LastName' columns
participants_df['FirstName'] = participants_df['FirstName'].str.strip().str.lower().fillna('')
participants_df['LastName'] = participants_df['LastName'].str.strip().str.lower().fillna('')
filtered_contacts_df['FirstName'] = filtered_contacts_df['FirstName'].str.strip().str.lower().fillna('')
filtered_contacts_df['LastName'] = filtered_contacts_df['LastName'].str.strip().str.lower().fillna('')

# Ensure 'joinDate' exists in participants_df
if 'joinDate' not in participants_df.columns:
    raise KeyError("The column 'joinDate' is missing in participants_df")

# Merge the cleaned data
merged_df_clean = pd.merge(filtered_contacts_df, 
                           participants_df[['FirstName', 'LastName', 'joinDate']], 
                           on=['FirstName', 'LastName'], 
                           how='left')

# Save the updated DataFrame to a CSV file
merged_df_clean.to_csv('./updated_filtered_contacts.csv', index=False)